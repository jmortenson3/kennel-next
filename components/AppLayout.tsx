import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@chakra-ui/breadcrumb';
import { Grid, GridItem, Center, HStack } from '@chakra-ui/layout';
import { useRouter } from 'next/dist/client/router';
import Link from 'next/link';

type Props = {
  children: any;
};

const AppLayout = ({ children }: Props) => {
  const router = useRouter();

  const pathItems = router.pathname.split('/').slice(1);
  const breadCrumbs: { relativePath: string; pathItem: string }[] =
    pathItems.map((pathItem, i, arr) => {
      return {
        relativePath: `/${arr.slice(0, i + 1).join('/')}`,
        pathItem: i === 0 ? 'home' : pathItem, // rename app to home
      };
    });

  return (
    <Grid
      height='100vh'
      overflowY='scroll'
      templateRows='75px 1fr'
      templateColumns=' 250px 1fr'
      gap={4}
    >
      <GridItem colSpan={1} rowSpan={2} bg='tomato'>
        <nav>
          <ul>
            <li>This</li>
            <li>Is</li>
            <li>Nav</li>
          </ul>
        </nav>
      </GridItem>
      <GridItem colSpan={1} bg='papayawhip'>
        <HStack>
          <Breadcrumb separator='/' fontSize='4xl' fontWeight='bold'>
            {breadCrumbs &&
              breadCrumbs.map((breadCrumb) => {
                return (
                  <BreadcrumbItem textTransform='capitalize'>
                    <BreadcrumbLink as={Link} href={breadCrumb.relativePath}>
                      {breadCrumb.pathItem}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                );
              })}
          </Breadcrumb>
        </HStack>
      </GridItem>
      {children}
      {/* <GridItem colSpan={2} bg='papayawhip' /> */}
    </Grid>
  );
};

export default AppLayout;
