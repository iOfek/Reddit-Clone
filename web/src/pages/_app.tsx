import { ChakraProvider } from "@chakra-ui/react";

import { AppProps } from "next/app";
import theme from "../theme";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme} cssVarsRoot={undefined}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
