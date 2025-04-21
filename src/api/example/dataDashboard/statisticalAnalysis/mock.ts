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
        name: "@姓名", // Random applicant name
      },
    ],
  });

  return createResponse("paging")(data);
});
