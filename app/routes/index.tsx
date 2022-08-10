import { Text, Stack, Center, Heading,Flex } from '@chakra-ui/react';
import { json, LoaderFunction, MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return {
    title: `Site Title`,
    description: `Site Description`,
  };
};

export const loader: LoaderFunction = async ({ request, params }) => {
  return json({
    headers: {
      "Cache-Control":
        "s-maxage=60, stale-while-revalidate=3600",
    },
  });
};

export function headers({ loaderHeaders }: { loaderHeaders: Headers }) {
  return {
    "cache-control": loaderHeaders.get("cache-control"),
  };
}

export default function Home() {
  return (
    <Stack gap={10}>
      <Center h={'55vh'}>
        <Stack>
          <Flex align={'center'} direction={'column'} gap={2}>
            <Heading>Remix Shoegaze Stack</Heading>
            <Text>Chakra UI + Supabase + Notion Integration</Text>
            <Text>Ready to deploy on Vercel</Text>
          </Flex>
        </Stack>
      </Center>
    </Stack>
  )
};
