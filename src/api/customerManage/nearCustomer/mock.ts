import Mock from "better-mock";
import { createResponse } from "@utils/request";

/**
 * @description: 列表
 * @return {*}
 */
Mock.mock(/\/admin\/nearCustomer\/list/, "get", () => {
  const data = Mock.mock({
    list: [
      {
        id: 1,
        companyName: "小草互联",
        // longitude: 114.232439,
        // latitude: 22.695842,
        longitude: "",
        latitude: "",
        provinceName: "@省",
        cityName: "@市",
        districtName: "@区",
        address: "aaa",
      },
      {
        id: 2,
        companyName: "深圳信息职业技术学院",
        longitude: 114.22,
        latitude: 22.69,
        provinceName: "@省",
        cityName: "@市",
        districtName: "@区",
        address: "aaa",
      },
      {
        id: 3,
        companyName: "大运中心",
        longitude: 114.22,
        latitude: 22.7,
        provinceName: "@省",
        cityName: "@市",
        districtName: "@区",
        address: "aaa",
      },
    ],
  });

  return createResponse("paging")(data);
});
