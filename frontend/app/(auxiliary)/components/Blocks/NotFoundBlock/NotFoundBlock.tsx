import buttonStyles from "@/app/(auxiliary)/components/UI/Button/Button.module.scss";
import { NotFoundDataTypes } from '@/app/(auxiliary)/types/Data/Interface/404/NotFoundDataTypes';
import notFoundData from "@/data/interface/404/data.json";
import { blue_dark } from '@/styles/colors';
import NotFoundLogo from '../../UI/SVG/NotFoundLogo/NotFoundLogo';
import Text from '../../UI/TextTemplates/Text';
import Title from '../../UI/TextTemplates/Title';
import styles from "./NotFoundBlock.module.scss";
import Link from 'next/link';
import ButtonText from '../../UI/TextTemplates/ButtonText';

const NotFoundBlock = () => {
    const data: NotFoundDataTypes = notFoundData

    return (
        <div className={styles.notFoundBlockWrapper}>
            <NotFoundLogo />

            <div className={styles.notFoundBlockDescription}>
                <Title>{data.title}</Title>
                <Text>{data.description}</Text>
            </div>

            <div className={styles.notFoundBlockButton}>
                <Link className={buttonStyles.button} style={{ backgroundColor: blue_dark }} href={"/"}>
                    <ButtonText>
                        {data.button}
                    </ButtonText>
                </Link>
            </div>
        </div>
    )
}

export default NotFoundBlock