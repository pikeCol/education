import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from './style.less';
import SchoolList from './components/schoolList';

const IndexHtml = () => {

  return (
    <>
      <PageHeaderWrapper />
      <div className={styles.bg} >
        <SchoolList id="schoolList" />
      </div>
    </>
  );
};

export default IndexHtml;
