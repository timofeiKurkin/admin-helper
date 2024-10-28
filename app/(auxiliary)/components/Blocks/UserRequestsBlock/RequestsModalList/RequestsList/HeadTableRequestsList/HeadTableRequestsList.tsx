import React, { FC } from 'react'
import { TableDataType } from '@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageContentType';
import rootContent from "@/data/interface/root-page/data.json"
import styles from "../RequestsList.module.scss";
import Text from '@/app/(auxiliary)/components/UI/TextTemplates/Text';


const HeadTableRequestsList: FC = () => {
    const tableHeader: TableDataType = rootContent.userRequests.modalData.tableData
    return (
        <div className={styles.headTableRequestsList}>
            {Object.values(tableHeader).map((headItem: string) => (
                <Text key={`key=${headItem}`}>
                    {headItem}
                </Text>
            ))}
        </div>
    )
}

export default HeadTableRequestsList