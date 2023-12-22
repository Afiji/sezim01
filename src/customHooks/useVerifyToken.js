

export const useVerifyToken = () => {
  const params = useParams();
  const currentToken = params.token;
  console.log(currentToken);

  //   const [searchParams, setSearchParams] = useSearchParams();
  //   console.log(searchParams);

  //   const currentToken = searchParams.get("token") || "not found";
  //   const setToken = (token) => {
  //     // console.log(token);
  //     setToken({ token: token });
  //   };
  //   console.log(currentToken);

  //   return [currentToken, setToken];
};
