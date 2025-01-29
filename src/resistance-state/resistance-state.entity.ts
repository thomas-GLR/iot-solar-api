import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ResistanceState {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  lastUpdate: Date;
  // True : allumé
  // False : éteinte
  @Column()
  currentState: boolean;

  lastUpdateToDate(): number {
    return this.lastUpdate.getDate();
  }
}
