/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout, { DefaultFooter } from '@ant-design/pro-layout';
import React, { useEffect, useState } from 'react';
import { Link, useIntl, connect } from 'umi';
import { Result, Button } from 'antd';
import { SmileOutlined, CrownOutlined, AreaChartOutlined, 
  BarChartOutlined, DotChartOutlined, LineChartOutlined, BankOutlined,
  ShareAltOutlined, DiffOutlined,PullRequestOutlined,UserAddOutlined, 
  AuditOutlined, FileProtectOutlined,ExceptionOutlined, IdcardOutlined, 
  ReconciliationOutlined, ReadOutlined} from '@ant-design/icons';
import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import { getAuthorityFromRouter } from '@/utils/utils';
import logo from '../assets/logo.svg';
import { getMobileCaptcha, getCaptcha } from '@/services/login';
import { getMenus } from '@/services/login';


const IconMap = {
  'smile': <SmileOutlined />,
  'crown': <CrownOutlined />,
  'area-chart': <AreaChartOutlined />,
  'bar-chart': <BarChartOutlined />,
  'dot-chart': <DotChartOutlined />,
  'line-chart': <LineChartOutlined />,
  'bank': <BankOutlined />,
  'share-alt': <ShareAltOutlined />,
  'diff': <DiffOutlined />,
  'pull-request': <PullRequestOutlined />,
  'user-add': <UserAddOutlined />,
  'audit': <AuditOutlined />,
  'file-protect': <FileProtectOutlined />,
  'exception': <ExceptionOutlined />,
  'idcard': <IdcardOutlined />,
  'reconciliation': <ReconciliationOutlined />,
  'read': <ReadOutlined />,
}


const noMatch = (
  <Result
    status={403}
    title="403"
    subTitle="Sorry, you are not authorized to access this page."
    extra={
      <Button type="primary">
        <Link to="/user/login">Go Login</Link>
      </Button>
    }
  />
);

/**
 * use Authorized check all menu item
 */
const menuDataRender = menuList => {
  console.log(menuList);
  return menuList.map(item => {
    const localItem = { 
      ...item, 
      children: item.children ? menuDataRender(item.children) : [],
      icon: item.icon && IconMap[item.icon]
    };
    // return Authorized.check(item.authority, localItem, null);
    return localItem
  });
}

const BasicLayout = props => {
  const {
    dispatch,
    children,
    settings,
    location = {
      pathname: '/',
    },
  } = props;
  const [menusList, setMenusList] = useState([])
  /**
   * constructor
   */

  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'user/fetchCurrent',
      });
    }
    getMenus().then(res => {
      if (res.code < 300) {
        const data = res.data
        data.unshift({
          path: '/welcome',
          name: 'welcome',
        })
        setMenusList(data)
        // setMenusList(data)
      }
    })
  }, []);
  /**
   * init variables
   */

  const handleMenuCollapse = payload => {
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      });
    }
  }; // get children authority

  const authorized = getAuthorityFromRouter(props.route.routes, location.pathname || '/') || {
    authority: undefined,
  };
  const { formatMessage } = useIntl();
  return (
    <ProLayout
      logo={logo}
      formatMessage={formatMessage}
      menuHeaderRender={(logoDom, titleDom) => (
        <Link to="/">
          {logoDom}
          {titleDom}
        </Link>
      )}
      onCollapse={handleMenuCollapse}
      menuItemRender={(menuItemProps, defaultDom) => {
        if (menuItemProps.isUrl || menuItemProps.children || !menuItemProps.path) {
          return defaultDom;
        }

        return <Link to={menuItemProps.path}>{defaultDom}</Link>;
      }}
      breadcrumbRender={(routers = []) => [
        {
          path: '/',
          breadcrumbName: formatMessage({
            id: 'menu.home',
          }),
        },
        ...routers,
      ]}
      itemRender={(route, params, routes, paths) => {
        const first = routes.indexOf(route) === 0;
        return first ? (
          <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
        ) : (
            <span>{route.breadcrumbName}</span>
          );
      }}
      menuDataRender={() => menuDataRender(menusList)}
      rightContentRender={() => <RightContent />}
      {...props}
      {...settings}
    >
      <Authorized authority={authorized.authority} noMatch={noMatch}>
        {children}
      </Authorized>

    </ProLayout>
  );
};

export default connect(({ global, settings }) => ({
  collapsed: global.collapsed,
  settings,
}))(BasicLayout);
