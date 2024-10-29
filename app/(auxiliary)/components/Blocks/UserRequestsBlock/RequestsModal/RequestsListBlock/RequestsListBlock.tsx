import { FC } from 'react';
import GetUserRequests from './GetUserRequests/GetUserRequests';
import HeaderOfTableList from './HeaderOfTableList/HeaderOfTableList';
import styles from "./RequestsListBlock.module.scss";

import dynamic from 'next/dynamic';

const LazyRequestsList = dynamic(() => import('./RequestsList/RequestsList'), { loading: () => <div>Loading...1</div> })

const RequestsListBlock: FC = () => {
    return (
        <div className={styles.requestsListWrapper}>
            <HeaderOfTableList />

            <GetUserRequests>
                <LazyRequestsList />
            </GetUserRequests>
        </div>
    )
}

export default RequestsListBlock;