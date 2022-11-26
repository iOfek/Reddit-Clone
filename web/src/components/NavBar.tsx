import { Box, Button, Flex, Link } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";
interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [, logout] = useLogoutMutation();
  const [{ data, fetching }] = useMeQuery({
    pause: isServer(),
  });
  console.log(data);
  let body = (
    <>
      <NextLink href="/login">
        <Link mr={2}>login</Link>
      </NextLink>
      <NextLink href="/register">
        <Link mr={2}>register</Link>
      </NextLink>
    </>
  );
  {
    fetching
      ? null
      : !data?.me
      ? null
      : (body = (
          <Flex>
            <Box mr={2}>{data.me.username}</Box>
            <Button
              onClick={() => {
                logout({});
              }}
              variant="link"
            >
              logout
            </Button>
          </Flex>
        ));
  }
  return (
    <Flex bg="tomato" p={4}>
      <Box ml={"auto"}>{body}</Box>
    </Flex>
  );
};
