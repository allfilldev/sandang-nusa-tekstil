export interface ProductCategory {
  id: string;
  name: string;
  description: string;
  commonUses: string[];
  details: string[];
  image: {
    src: string;
    width: number;
    height: number;
    alt: string;
  };
}

export interface FabricStructure {
  id: string;
  family: string;
  name: string;
  traits: string;
  commonUses: string;
}
