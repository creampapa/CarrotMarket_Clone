import type { NextPage } from "next";
import Layout from "@components/layout";
import ProductList from "@components/product-list";

const Bought: NextPage = () => {
  return (
    <Layout canGoBack title="구매내역" seoTitle="Bought">
      <div className="flex flex-col space-y-5 divide-y ">
        <ProductList kind={"purchases"} />
      </div>
    </Layout>
  );
};

export default Bought;
