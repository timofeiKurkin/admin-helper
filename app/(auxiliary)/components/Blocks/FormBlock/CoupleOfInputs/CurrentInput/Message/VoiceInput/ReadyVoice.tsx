import React from 'react';
import Play from "@/app/(auxiliary)/components/UI/SVG/Play/Play";
import Button from "@/app/(auxiliary)/components/UI/Button/Button";
import Replay from "@/app/(auxiliary)/components/UI/SVG/Replay/Replay";

const ReadyVoice = () => {
    return (
        <div style={{
            display: "grid",
            gridTemplateColumns: "3.3125rem 9.875rem 3.3125rem",
            gridTemplateRows: "3.3125rem",
            columnGap: "0.94rem",
        }}>
            <Button image={{
               children: <Play/>,
               visibleOnlyImage: true,
            }}/>

            <div>record</div>

            <Button image={{
                children: <Replay/>,
                visibleOnlyImage: true,
            }}/>
        </div>
    );
};

export default ReadyVoice;