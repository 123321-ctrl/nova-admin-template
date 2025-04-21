import Mock from "better-mock";

Mock.Random.extend({
  姓名: function () {
    return this.cname();
  },
});
