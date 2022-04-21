import type { NextPage } from "next";
import Button from "@components/button";
import Layout from "@components/layout";
import { useRouter } from "next/router";
import useSWR, { useSWRConfig } from "swr";
import Link from "next/link";
import { Product, User } from "@prisma/client";
import useMutation from "@libs/client/useMutation";
import { cls } from "@libs/client/utils";

interface ProductWithUser extends Product {
  user: User;
} // Product에는 user가 없기 때문에 extend 하여 사용

interface ItemDetailResponse {
  ok: boolean;
  product: ProductWithUser;
  relatedProducts: Product[];
  isLiked: boolean;
}

const ItemDetail: NextPage = () => {
  const router = useRouter(); //using router current page check
  //const { mutate: unBoundMutate } = useSWRConfig();
  const { data, mutate } = useSWR<ItemDetailResponse>(
    router.query.id ? `/api/products/${router.query?.id}` : null
  ); //optional query, mutate로 캐시된 데이터 실시간 변경가능

  const [toggleFav, { loading }] = useMutation(
    `/api/products/${router.query?.id}/fav`
  );
  const onFavClick = () => {
    if (!data) return;
    //bound mutation 현재페이지 조작
    mutate((prev) => prev && { ...prev, isLiked: !prev.isLiked }, false);
    // mutate로 데이터 조작 첫번째 인자는 케시변경 할 데이터 두번째 인자, revalidate는 데이터 다시 불러올지 여부(boolean)

    //unbound mutation 다른페이지 조작가능
    //unBoundMutate("/api/users/me", (prev : any) => prev && { ...prev, ok: !prev.ok }, false);
    if (!loading) {
      toggleFav({});
    }
  };

  return (
    <Layout canGoBack>
      <div className="px-4 py-4">
        <div className="mb-8">
          <div className="h-96 bg-slate-300" />
          <div className="flex cursor-pointer items-center space-x-3 border-t border-b py-3">
            <div className="h-12 w-12 rounded-full bg-slate-300" />
            <div>
              <p className="text-sm font-medium text-gray-700">
                {!data ? "loading..." : data?.product?.user?.name}
              </p>
              <Link href={`/users/profiles/${data?.product?.user?.id}`}>
                <a className="text-xs font-medium text-gray-500">
                  View profile &rarr;
                </a>
              </Link>
            </div>
          </div>
          <div className="mt-5">
            <h1 className="text-3xl font-bold text-gray-900">
              {!data ? "loading..." : data?.product?.name}
            </h1>
            <span className=" mt-3 block text-2xl text-gray-700">
              {!data ? "loading..." : data?.product?.price}
            </span>
            <p className="my-6 text-base text-gray-600">
              {!data ? "loading..." : data?.product?.description}
            </p>
            <div className="flex items-center justify-between space-x-2">
              <Button large text="Talk to seller" />
              <button
                onClick={onFavClick}
                className={cls(
                  "flex items-center justify-center rounded-md p-3 hover:bg-gray-100 ",
                  data?.isLiked
                    ? "text-red-500  hover:text-red-600"
                    : "text-gray-400  hover:text-gray-500"
                )}
              >
                {data?.isLiked ? (
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                ) : (
                  <svg
                    className="h-6 w-6 "
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Similar items</h2>
          <div className="mt-6 grid grid-cols-2 gap-4">
            {data?.relatedProducts.map((product) => (
              <div key={product?.id}>
                <Link href={`/products/${product?.id}`}>
                  <a>
                    <div className="mb-4 h-56 w-full bg-slate-300" />
                    <h3 className="-mb-1 text-gray-700">{product?.name}</h3>
                    <span className="text-sm font-medium text-gray-900">
                      {product?.price}
                    </span>
                  </a>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ItemDetail;