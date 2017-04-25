export interface ExportReport {
    period: string;
    itemName: string;
    organizationName: string;
    abcCode: string;
    annualUsagePieces: number;
    itemCost:number;
    scheduledReceipts: number;
    qtyInRec: number;
    nettableOnHand: number;
    excessQty: number;
    totalInventory: number;
    excessInventoryQty: number;
    excessQtyOnOrder: number;
    excessInventoryCost: number;
    excessOnOrderCost: number;
    dInventoryCost: number;
    excessDInventoryCostWithNoAnnualUsage: number;
    excessDOnOrderCostWithNoAnnualUsage: number;
    excessDInventoryCostExcludesDUse: number;
    excessDOnOrderCostExcludesDUse: number;
    futurePlannedOrdersExcess: number;
}