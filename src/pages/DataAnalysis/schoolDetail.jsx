import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from './style.less';
import SchoolView from './components/schoolView';

const IndexHtml = () => {

  return (
    <>
      <PageHeaderWrapper />
      <div className={styles.bg} >
        <SchoolView id="schoolView" />
      </div>
    </>
  );
};

export default IndexHtml;
