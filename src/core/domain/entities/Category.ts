export type CategoryId =
  | 'all'
  | 'ventanas'
  | 'mamparas'
  | 'fachadas'
  | 'vitrinas'
  | 'pergolas'
  | 'puertas';

export interface Category {
  id: CategoryId;
  name: string;
  shortName: string;
  description: string;
  iconName: string;
  productCount: number;
}
