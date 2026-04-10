import { ElNotification, ElButton } from 'element-plus';
import { h, type VNode } from 'vue';
import moment from 'moment';

interface VersionInfo {
  version: string;
  buildTime: string;
}

interface UpdateInfo {
  hasUpdate: boolean;
  currentVersion: string;
  latestVersion: string;
}

class VersionChecker {
  private currentVersion: string;
  private buildTime: string;

  private autoCheck: boolean = true;
  private checkInterval: number = 30 * 60 * 1000; // 30分钟检查一次
  private intervalId: number | null = null;

  private callbacks: Array<(updateInfo: UpdateInfo) => void> = [];
  // 当前通知实例
  private currentNotification: any = null;
  // 升级弹框的独立 class 名称
  private readonly UPGRADE_NOTIFICATION_CLASS = 'version-upgrade-notification-active';
  // 本地存储的key
  private readonly UPDATE_CLICKED_KEY = 'version_update_clicked';
  // 上次检查时间
  private lastCheckTime: number = 0;
  // 页面聚焦检查的最小间隔（5分钟）
  private readonly FOCUS_CHECK_INTERVAL = 5 * 60 * 1000;

  constructor() {
    this.currentVersion = __APP_VERSION__ || '1.0.0';
    this.buildTime = __BUILD_TIME__ || new Date().toISOString();
  }

  /**
   * @description: 获取当前版本信息
   * @return {VersionInfo} 版本信息对象
   */
  getCurrentVersion(): VersionInfo {
    return {
      version: this.currentVersion,
      buildTime: this.buildTime,
    };
  }

  /**
   * @description: 在控制台打印版本信息
   * @return {void}
   */
  private printVersionInfo(): void {
    const versionInfo = this.getCurrentVersion();

    // 将构建时间转换为北京时间显示
    const buildTimeBeijing = moment(versionInfo.buildTime).utcOffset(8);

    console.group('📦 客户端版本信息');
    console.log(`版本号: ${versionInfo.version}`);
    console.log(`构建时间: ${versionInfo.buildTime}`);
    console.log(`构建时间（北京时间）: ${buildTimeBeijing.format('YYYY-MM-DD HH:mm:ss')}`);
    console.groupEnd();
  }

  /**
   * @description: 记录检查时间
   * @return {void}
   */
  private recordCheckTime(): void {
    this.lastCheckTime = Date.now();
  }

  /**
   * @description: 处理页面可见性变化事件
   * @return {void}
   */
  private handleVisibilityChange(): void {
    if (document.visibilityState === 'visible') {
      const now = Date.now();
      const timeSinceLastCheck = now - this.lastCheckTime;

      // 如果距离上次检查超过5分钟，立即检查
      if (timeSinceLastCheck >= this.FOCUS_CHECK_INTERVAL) {
        this.checkForUpdate();
      }
    }
  }

  /**
   * @description: 设置检查间隔
   * @param {number} interval 检查间隔时间（毫秒）
   * @return {void}
   */
  setCheckInterval(interval: number): void {
    this.checkInterval = interval;
    if (this.intervalId) {
      this.stopPeriodicCheck();
    }
  }

  /**
   * @description: 开始定期检查版本更新
   * @return {void}
   */
  startPeriodicCheck(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    // 立即检查一次
    this.checkForUpdate();

    // 设置定期检查
    this.intervalId = window.setInterval(() => {
      this.checkForUpdate();
    }, this.checkInterval);

    // 只有当定时轮询间隔大于等于页面可见性检查间隔时，才启用页面可见性检查
    if (this.checkInterval >= this.FOCUS_CHECK_INTERVAL) {
      // 监听页面可见性变化事件
      document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    }
  }

  /**
   * @description: 停止定期检查
   * @return {void}
   */
  stopPeriodicCheck(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    // 只有当启用了页面可见性检查时才移除监听
    if (this.checkInterval >= this.FOCUS_CHECK_INTERVAL) {
      // 移除页面可见性变化事件监听
      document.removeEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    }
  }

  /**
   * @description: 获取远程版本信息（从 /version.json 文件）
   * @return {Promise<VersionInfo | null>} 远程版本信息
   */
  private async getRemoteVersionInfo(): Promise<VersionInfo | null> {
    try {
      const response = await fetch('/version.json?t=' + Date.now(), {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });

      if (response.ok) {
        return await response.json();
      }
    } catch (_error) {
      // 忽略错误，version.json 文件可能不存在
      console.warn('无法获取 version.json 文件');
    }
    return null;
  }

  /**
   * @description: 比较版本号
   * @param {string} version1 版本号1 (格式: YYYYMMDD.HM.随机字符串)
   * @param {string} version2 版本号2 (格式: YYYYMMDD.HM.随机字符串)
   * @return {number} 比较结果(-1: version1 < version2, 0: 相等, 1: version1 > version2)
   */
  private compareVersions(version1: string, version2: string): number {
    // 如果版本号完全相同，直接返回0
    if (version1 === version2) {
      return 0;
    }
    try {
      // 解析版本号: YYYYMMDD.HM.随机字符串
      const parseVersion = (version: string) => {
        const parts = version.split('.');
        if (parts.length !== 3) {
          throw new Error('Invalid version format');
        }

        const datePart = parts[0]; // YYYYMMDD
        const timePart = parseInt(parts[1], 10); // HM
        const randomPart = parts[2]; // 随机字符串

        return {
          date: parseInt(datePart, 10), // 将YYYYMMDD转为数字比较
          time: timePart,
          random: randomPart,
        };
      };

      const v1 = parseVersion(version1);
      const v2 = parseVersion(version2);

      // 首先比较日期部分
      if (v1.date < v2.date) return -1;
      if (v1.date > v2.date) return 1;

      // 日期相同，比较时间部分
      if (v1.time < v2.time) return -1;
      if (v1.time > v2.time) return 1;

      // 日期和时间都相同，比较随机字符串（字典序）
      if (v1.random < v2.random) return -1;
      if (v1.random > v2.random) return 1;

      return 0;
    } catch (error) {
      console.warn('版本号格式错误，使用字符串比较:', error);
      return 0;
    }
  }

  /**
   * @description: 检查是否已经存在升级弹框
   * @return {boolean} 是否存在升级弹框
   */
  private hasUpgradeNotification(): boolean {
    return document.querySelector(`.${this.UPGRADE_NOTIFICATION_CLASS}`) !== null;
  }

  /**
   * @description: 检查用户是否已点击过立即更新
   * @return {boolean} 是否已点击过立即更新
   */
  private hasClickedUpdate(): boolean {
    try {
      const clickedData = sessionStorage.getItem(this.UPDATE_CLICKED_KEY);
      if (!clickedData) return false;

      const { version } = JSON.parse(clickedData);

      // 检查是否是当前版本
      return version === this.currentVersion;
    } catch (error) {
      console.warn('检查更新点击记录失败:', error);
      return false;
    }
  }

  /**
   * @description: 检查版本更新
   * @return {Promise<UpdateInfo>} 更新信息
   */
  async checkForUpdate(): Promise<UpdateInfo> {
    // 记录检查时间
    this.recordCheckTime();

    // 如果已经显示过升级提示，直接返回无更新
    if (this.hasUpgradeNotification()) {
      return {
        hasUpdate: false,
        currentVersion: this.currentVersion,
        latestVersion: this.currentVersion,
      };
    }

    // 如果用户已经点击过立即更新（1小时内），跳过检查
    if (this.hasClickedUpdate()) {
      return {
        hasUpdate: false,
        currentVersion: this.currentVersion,
        latestVersion: this.currentVersion,
      };
    }

    try {
      // 1. 优先检查 /version.json 文件获取最新版本信息
      const remoteVersionInfo = await this.getRemoteVersionInfo();

      let hasUpdate = false;
      let latestVersion = this.currentVersion;

      if (remoteVersionInfo) {
        // 比较版本号
        const versionComparison = this.compareVersions(
          remoteVersionInfo.version,
          this.currentVersion,
        );
        if (versionComparison > 0) {
          hasUpdate = true;
          latestVersion = remoteVersionInfo.version;
        }
      }

      const updateInfo: UpdateInfo = {
        hasUpdate,
        currentVersion: this.currentVersion,
        latestVersion,
      };

      // 通知所有监听器
      if (hasUpdate) {
        this.callbacks.forEach((callback) => callback(updateInfo));
      }

      return updateInfo;
    } catch (error) {
      console.error('检查版本更新失败:', error);
      // 版本检查失败时，也判定为需要升级
      const updateInfo: UpdateInfo = {
        hasUpdate: false,
        currentVersion: this.currentVersion,
        latestVersion: '',
      };
      // 通知所有监听器
      this.callbacks.forEach((callback) => callback(updateInfo));
      return updateInfo;
    }
  }

  /**
   * @description: 添加更新回调
   * @param {Function} callback 更新回调函数
   * @return {void}
   */
  onUpdate(callback: (updateInfo: UpdateInfo) => void): void {
    this.callbacks.push(callback);
  }

  /**
   * @description: 显示版本更新通知
   * @param {UpdateInfo} info 更新信息
   * @return {void}
   */
  private showVersionNotification(info: UpdateInfo): void {
    // 如果已经存在升级弹框，忽略后续提示
    if (this.hasUpgradeNotification()) {
      console.log('已存在升级弹框，忽略后续提示');
      return;
    }

    // 停止定期检查
    this.stopPeriodicCheck();

    // 使用 VNode 构建通知消息内容
    const messageContent: VNode = h('div', [
      info.latestVersion && h('div', `最新版本：${info.latestVersion}`),
      h('div', { style: { marginTop: '12px', textAlign: 'right' } }, [
        h(
          ElButton,
          {
            size: 'small',
            onClick: () => {
              if (this.currentNotification) {
                this.currentNotification.close();
                this.currentNotification = null;
              }
            },
          },
          { default: () => '稍后提醒' },
        ),
        h(
          ElButton,
          {
            type: 'primary',
            size: 'small',
            style: { marginLeft: '8px' },
            onClick: () => {
              if (this.currentNotification) {
                this.currentNotification.close();
                this.currentNotification = null;
              }
              this.updateNow();
            },
          },
          { default: () => '立即更新' },
        ),
      ]),
    ]);

    this.currentNotification = ElNotification({
      title: '发现新版本',
      message: messageContent,
      duration: 0,
      position: 'bottom-right',
      showClose: true,
      customClass: this.UPGRADE_NOTIFICATION_CLASS,
      onClose: () => {
        // 通知关闭时清理实例
        this.currentNotification = null;
      },
    });
  }

  /**
   * @description: 记录用户点击了立即更新
   * @return {void}
   */
  private recordUpdateClick(): void {
    try {
      const clickData = {
        version: this.currentVersion,
        timestamp: Date.now(),
      };
      sessionStorage.setItem(this.UPDATE_CLICKED_KEY, JSON.stringify(clickData));
    } catch (error) {
      console.warn('记录更新点击失败:', error);
    }
  }

  /**
   * @description: 重新加载应用
   * @return {void}
   */
  reloadApp(): void {
    window.location.reload();
  }

  /**
   * @description: 立即更新应用
   * @return {void}
   */
  private updateNow(): void {
    // 记录用户点击了立即更新
    this.recordUpdateClick();

    this.reloadApp();
  }

  /**
   * @description: 初始化版本更新功能
   * @param {boolean} autoCheck 是否自动检查
   * @param {number} checkInterval 检查间隔（毫秒）
   * @return {void}
   */
  init(autoCheck: boolean = true, checkInterval: number = 30 * 60 * 1000) {
    // 打印当前版本信息到控制台
    this.printVersionInfo();

    this.autoCheck = autoCheck;
    this.setCheckInterval(checkInterval);

    if (this.autoCheck) {
      this.startPeriodicCheck();
    }

    // 监听更新事件，自动显示通知
    this.onUpdate((info) => {
      if (info.hasUpdate) {
        this.showVersionNotification(info);
      }
    });
  }
}

// 创建单例实例
const versionChecker = new VersionChecker();

export default versionChecker;
