import React, { FC } from 'react'
import { ModalDataType, TableDataType } from '@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageContentType';
import rootContent from "@/data/interface/root-page/data.json"
import styles from "../RequestsListBlock.module.scss";
import Text from '@/app/(auxiliary)/components/UI/TextTemplates/Text';
import SeparatingLine from '@/app/(auxiliary)/components/UI/SeparatingLine/SeparatingLine';
import { black } from '@/styles/colors';
import { useAppSelector } from '@/app/(auxiliary)/libs/redux-toolkit/store/hooks';
import { selectUserDevice } from '@/app/(auxiliary)/libs/redux-toolkit/store/slices/AppSlice/AppSlice';


const HeaderOfTableList: FC = () => {
    const phoneAdaptive = useAppSelector(selectUserDevice).phoneAdaptive
    const modalData: ModalDataType = rootContent.userRequests.modalData
    const tableHeader: TableDataType = phoneAdaptive ? modalData.tableDataMobile : modalData.tableDataDesktop

    return (
        <div>
            <div className={styles.headTable}>
                {Object.values(tableHeader).map((headItem: string) => (
                    <Text key={`key=${headItem}`} style={{ fontWeight: 500 }}>
                        {headItem}
                    </Text>
                ))}

            </div>

            <SeparatingLine style={{ width: "100%", backgroundColor: black }} className={styles.headTableLine}/>
        </div>
    )
}

export default HeaderOfTableList