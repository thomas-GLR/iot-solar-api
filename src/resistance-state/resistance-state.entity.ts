import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ResistanceState {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  lastUpdate: Date;
  // True : allumé
  // False : éteinte
  @Column()
  currentState: boolean;

  lastUpdateToDate(): number {
    return this.lastUpdate.getDate();
  }
}
