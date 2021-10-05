import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@chakra-ui/breadcrumb';
import { Grid, GridItem, Center, HStack } from '@chakra-ui/layout';
import { useRouter } from 'next/dist/client/router';
import Link from 'next/link';
import AppNav from './AppNav';

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
      templateColumns='150px 1fr'
      gap={4}
    >
      <GridItem colSpan={1} rowSpan={2} bg='#153a33'>
        <AppNav />
      </GridItem>
      <GridItem colSpan={1} bg='#E9C42D'>
        <HStack>
          <Breadcrumb separator='/' fontSize='4xl' fontWeight='bold'>
            {breadCrumbs &&
              breadCrumbs.map((breadCrumb) => {
                return (
                  <BreadcrumbItem key={breadCrumb.relativePath} textTransform='capitalize'>
                    <BreadcrumbLink as={Link} href={breadCrumb.relativePath}>
                      {breadCrumb.pathItem}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                );
              })}
          </Breadcrumb>
        </HStack>
      </GridItem>
      <GridItem>
      {children}
      {/* <GridItem colSpan={2} bg='papayawhip' /> */}
      </GridItem>
    </Grid>
  );
};

export default AppLayout;
