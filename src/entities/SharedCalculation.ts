import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Calculation } from './Calculation';

@Entity('shared_calculations')
export class SharedCalculation {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Calculation, { eager: true })
  @JoinColumn({ name: 'calculationId' })
  calculation!: Calculation;

  @Column({ type: 'integer' })
  calculationId!: number;

  @Column({ type: 'text', default: 'Anonymous' })
  sharedBy!: string;

  @CreateDateColumn()
  sharedAt!: Date;
}
