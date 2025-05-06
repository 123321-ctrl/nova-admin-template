import Mock, { type MockCbOptions } from "better-mock";
import { createResponse } from "@utils/request";

/**
 * @description: 列表
 * @return {*}
 */
Mock.mock(/\/admin\/example\/list/, "get", ({ url }: MockCbOptions) => {
  const params = new URLSearchParams(url.split("?")[1]);

  const page = Number(params.get("page"));
  const limit = Number(params.get("limit"));

  const data = Mock.mock({
    count: limit * 6,
    [`list|${limit}`]: [
      {
        "id|+1": page * limit,
        name: "@姓名",
        status: "@pick([1,2])",
        image: "@图片",
        address: "广东省",
        tags: [1, 2, 3],
        startTime: "@日期",
        "money|0-1000000": 500,
        "money2|0-1000000": 500,
        contactPhone: "@手机号",
        tagsTest: ["广东省", "浙江省", "江苏省"],
      },
    ],
  });

  return createResponse("paging")(data);
});
