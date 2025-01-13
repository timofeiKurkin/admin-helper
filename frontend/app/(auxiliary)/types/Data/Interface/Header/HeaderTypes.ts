export interface HeaderTypes {
    logo: HeaderLogoType;
    repairService: HeaderRepairServiceType;
}

interface HeaderLogoType {
    imageSrc: string;
    logoTitleDesktop: string;
    logoTitleMobile: string;
}

interface HeaderRepairServiceType {
    linkToRepairService: string;
    textToRepairService: string;
}
