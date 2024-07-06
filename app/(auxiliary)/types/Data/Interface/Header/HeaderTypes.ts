export interface HeaderTypes {
    logo: Logo
    repairService: RepairService
}

export interface Logo {
    imageSrc: string
    title: string
}

export interface RepairService {
    linkToRepairService: string
    textToRepairService: string
}
