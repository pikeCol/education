import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from './style.less';
import PersonalView from './components/personalView';

const IndexHtml = () => {

  return (
    <>
      <PageHeaderWrapper />
      <div className={styles.bg} >
        <PersonalView id="personalView" />
      </div>
    </>
  );
};

export default IndexHtml;
