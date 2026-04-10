import Mock from 'better-mock';

Mock.Random.extend({
  姓名: function () {
    return this.cname();
  },
  日期: function () {
    return 1577836800 + this.integer(0, new Date().getTime() / 1000 - 1577836800);
  },
  手机号: function () {
    return this.pick(['132', '135', '189', '155', '181']) + Mock.mock(/\d{8}/);
  },
  图片: function () {
    return this.image('100x100', this.color(), this.color(), this.word());
  },
});
