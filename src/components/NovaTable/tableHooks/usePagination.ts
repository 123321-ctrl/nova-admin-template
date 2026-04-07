import { h, reactive } from "vue";
import { ElPagination } from "element-plus";

export function usePagination(context: any) {
  const { props } = context;
  const pagingConfig = reactive({
    pagerCount: 5,
    defaultPageSize: 30,
    pageSizes: [30, 100, 200, 300],
    layout: "sizes, prev, pager, next, jumper",
    ...props.pagingConfig
  });

  return {
    render: () => {
      if (!props.page) return;
      const page = props.page || 1;
      const limit = props.limit || 30;
      const pageTotal = props.pageTotal || 0;

      const total = `共 ${pageTotal} 条记录 第 ${page}/${Math.ceil(pageTotal / limit) || 1} 页`;

      return h("div", { class: "nova-table-pagination" }, [
        h("div", { class: "nova-table-pagination-left" }, "left"),
        h("div", { class: "nova-table-pagination-right" }, [
          h("span", { class: "nova-table-pagination-right-total" }, total),
          h(ElPagination, {
            size: "small",
            currentPage: page,
            pageSize: limit,
            total: pageTotal,
            ...pagingConfig,
            onSizeChange: (newSize: any) => {
              console.log(newSize);
              // 处理页面大小变化
            },
            onCurrentChange: (newPage: any) => {
              // 处理当前页变化
              console.log(newPage);
            }
          })
        ])
      ]);
    }
  };
}
