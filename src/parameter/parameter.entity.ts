import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Parameter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  value: string;
}
