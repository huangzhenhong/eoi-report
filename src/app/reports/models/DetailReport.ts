export interface DetailReport {
    item_name: string;
    organization_name: string;

    p1_Date: string;
    P1_itemCost:number;
    P1_scheduledReceipts: number;
    P1_qtyInRec: number;
    P1_nettableOnHand: number;
    P1_excessQty: number;
    P1_totalInventory: number;
    P1_excessInventoryQty: number;
    P1_excessQtyOnOrder: number;
    p1_abc_code: string;
    p1_annual_usage_pieces: number;

    p2_Date: string;
    p2_itemCost:number;
    p2_scheduledReceipts: number;
    p2_qtyInRec: number;
    p2_nettableOnHand: number;
    p2_excessQty: number;
    p2_totalInventory: number;
    p2_excessInventoryQty: number;
    p2_excessQtyOnOrder: number;
    p2_abc_code: string;
    p2_annual_usage_pieces: number;
    
    p1_p2_ExcessInventoryQty: number;
    p1_p2_ExcessQtyOnOrder: number;
    p1_p2_ExcessInvCost: number;
    p1_p2_ExcessCostOnOrder: number;
    p1_P2_Excess_Inv_Cost_No_Annual_Usage : number;
    p1_P2_Excess_On_Order_Cost_No_Annual_Usage : number;
    p1_P2_Excess_Inv_Cost_exclude_D_USE : number;
    p1_P2_Excess_On_Order_Cost_exclude_D_USE : number;

    planner_code: string;
    planner_name: string;
    buyer_name: string;
    make_buy: string;
    item_type: string;
    uom: string;
    value_stream: string;
    roq_calc : number;
    safety_stock_Quantity: number;
    annual_usage_pieces: number;
    vendor_name: string;
    inventory_item_status_code: string;
    supply_type: string;
    material_desc : string;
    spec: string;
    pattern: string;
}