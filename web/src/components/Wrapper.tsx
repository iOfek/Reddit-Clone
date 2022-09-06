import { Box } from "@chakra-ui/react";
import React from "react";

interface WrapperProps {
  children: React.ReactNode;
}

export const Wrapper: React.FC<WrapperProps> = ({ children }) => {
  return (
    <Box mt={8} mx="auto" maxW="800px" w="100%">
      {children}
    </Box>
  );
};
