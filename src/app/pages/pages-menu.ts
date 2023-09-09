import { NbMenuItem } from '@nebular/theme';
import { link } from 'fs';

export const MENU_ITEMS: NbMenuItem[] = [
  // {
  //   title: 'E-commerce',
  //   icon: 'shopping-cart-outline',
  //   link: '/pages/dashboard',
  //   home: true,
  // },
  {
    title: 'Dashboard',
    icon: 'home-outline',
    link: '/pages/dashboard',
  },
  {
    title: 'Customer',
    icon: 'person',
    link: '/pages/customer',
  },
  {
    title: 'Transaction',
    icon: 'layers-outline',
    link: '/pages/transaction',
  },
  {
    title: 'Scan',
    icon:'inbox-outline',
    link: '/pages/scan',
  },
  {
    title: 'Customer Transaction',
    icon:'file-text-outline',
    link: '/pages/search-customer-transaction',
  },
  {
    title: 'Generate Stamp',
    icon: 'file-add-outline',
    children: [
      {
        title: 'Stamp List',
        icon: 'file-text-outline',
        link: '/pages/generate-stamp/stamp-list',
      },
    ]
  },
  {
    title: 'Admin Area',
    icon: 'award-outline',
    children: [
      {
        title: 'Marketing',
        icon: 'tv-outline',
        children: [
          {
            title: 'Banner List',
            link: '/pages/admin-area/marketing/banner-list',
          }
        ]
      },
      {
        title: 'Master',
        icon: 'cube-outline',
        children: [
          {
            title: 'Branch',
            link: '/pages/admin-area/master/branch-list',
          },
          {
            title: 'Company',
            link: '/pages/admin-area/master/company-list',
          }
        ]
      },
    // {
    //   title: 'Report',
    //   icon: 'printer-outline',
    //   children: [
    //     {
    //       title: 'Download',
    //       link: '/pages/admin-area/report/download',
    //     }
    //   ]
    // },
      {
        title: 'User management',
        icon: 'person-add-outline',
        children: [
          {
            title: 'Menu List',
            link: '/pages/admin-area/user-management/menu-list',
          },
          {
            title: 'User Roles List',
            link: '/pages/admin-area/user-management/user-role-list',
          },
          {
            title: 'User Management List',
            link: '/pages/admin-area/user-management/user-list',
          }
        ]
      },
    ]
  },

];
