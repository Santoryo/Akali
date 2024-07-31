export interface Metadata {
    bonusDescriptions: string[];
    guaranteedDescriptions: string[];
    tooltipsDisabled: boolean;
  }
  
  export interface Output {
    // Define the structure of the Output object here
  }
  
  export interface Slot {
    // Define the structure of the Slot object here
  }
  
  export interface MythicShopItem {
    contextMenuText: string;
    crafterName: string;
    description: string;
    displayCategories: string;
    hasVisibleLootOdds: boolean;
    imagePath: string;
    introVideoPath: string;
    loopVideoPath: string;
    lootMilestoneIds: any[];
    metadata: Metadata;
    outputs: Output[];
    outroVideoPath: string;
    recipeName: string;
    requirementText: string;
    singleOpen: boolean;
    slots: Slot[];
    type: string;
  }
  
  export type MythicShop = MythicShopItem[];