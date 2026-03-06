import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/lib/database';
import { Calculation } from '@/entities/Calculation';
import { SharedCalculation } from '@/entities/SharedCalculation';

export async function GET() {
  try {
    const ds = await getDataSource();
    const repo = ds.getRepository(SharedCalculation);
    const shared = await repo.find({
      order: { sharedAt: 'DESC' },
      take: 100,
      relations: ['calculation'],
    });

    const result = shared.map((s) => ({
      id: s.id,
      calculationId: s.calculationId,
      expression: s.calculation?.expression,
      result: s.calculation?.result,
      sharedBy: s.sharedBy,
      sharedAt: s.sharedAt,
    }));

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('GET /api/shared error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch shared calculations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { calculationId } = body;

    if (!calculationId) {
      return NextResponse.json(
        { success: false, error: 'calculationId is required' },
        { status: 400 }
      );
    }

    const ds = await getDataSource();
    const calcRepo = ds.getRepository(Calculation);
    const sharedRepo = ds.getRepository(SharedCalculation);

    const calculation = await calcRepo.findOne({ where: { id: calculationId } });
    if (!calculation) {
      return NextResponse.json(
        { success: false, error: 'Calculation not found' },
        { status: 404 }
      );
    }

    // Mark as shared
    calculation.isShared = true;
    await calcRepo.save(calculation);

    // Create shared record
    const shared = sharedRepo.create({
      calculationId,
      sharedBy: 'Anonymous',
    });
    await sharedRepo.save(shared);

    return NextResponse.json({ success: true, data: shared }, { status: 201 });
  } catch (error) {
    console.error('POST /api/shared error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to share calculation' },
      { status: 500 }
    );
  }
}
