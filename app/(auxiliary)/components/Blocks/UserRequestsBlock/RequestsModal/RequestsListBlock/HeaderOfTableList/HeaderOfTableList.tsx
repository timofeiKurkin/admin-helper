import React, { FC } from 'react'
import { TableDataType } from '@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageContentType';
import rootContent from "@/data/interface/root-page/data.json"
import styles from "../RequestsListBlock.module.scss";
import Text from '@/app/(auxiliary)/components/UI/TextTemplates/Text';
import SeparatingLine from '@/app/(auxiliary)/components/UI/SeparatingLine/SeparatingLine';
import { black } from '@/styles/colors';


const HeaderOfTableList: FC = () => {
    const tableHeader: TableDataType = rootContent.userRequests.modalData.tableData
    return (
        <div>
            <div className={styles.headTable}>
                {Object.values(tableHeader).map((headItem: string) => (
                    <Text key={`key=${headItem}`}>
                        {headItem}
                    </Text>
                ))}

            </div>

            <SeparatingLine style={{ width: "100%", height: 2, backgroundColor: black }} />
        </div>
    )
}

export default HeaderOfTableList