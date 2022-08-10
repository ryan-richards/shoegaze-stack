import { Flex,Text } from "@chakra-ui/react";
import { Link } from "@remix-run/react";

const Footer = () => {
  return (
    <Flex as="footer" width="full" justify={'center'} pb={10}>
      <Text>
        {new Date().getFullYear()} -{" "}
        <Link to={'/'}>
          Remix Shoegaze Stack
        </Link>
      </Text>
    </Flex>
  );
};

export default Footer;
