// api/pengawas/forms/[id]/status/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const formId = params.id;
    const { status, pengawas_id, rejection_reason } = await request.json();

    // Validasi input
    if (!status || !pengawas_id) {
      return NextResponse.json({ error: 'Status and pengawas_id are required' }, { status: 400 });
    }

    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status. Must be: approved, rejected, or pending' }, { status: 400 });
    }

    // Verify form exists and pengawas has access
    const { data: existingForm, error: fetchError } = await supabase.from('p2h_forms').select('id, pengawas_id, status').eq('id', formId).eq('pengawas_id', pengawas_id).single();

    if (fetchError || !existingForm) {
      return NextResponse.json({ error: 'Form not found or access denied' }, { status: 404 });
    }

    // Update status
    const updateData: any = {
      status: status,
      updated_at: new Date().toISOString(),
    };

    // Add approval/rejection timestamp and reason
    if (status === 'approved') {
      updateData.approved_at = new Date().toISOString();
      updateData.approved_by = pengawas_id;
    } else if (status === 'rejected') {
      updateData.rejected_at = new Date().toISOString();
      updateData.rejection_reason = rejection_reason || null;
    }

    const { data: updatedForm, error: updateError } = await supabase.from('p2h_forms').update(updateData).eq('id', formId).select().single();

    if (updateError) {
      console.error('Error updating form status:', updateError);
      throw updateError;
    }

    return NextResponse.json({
      success: true,
      message: `Form successfully ${status}`,
      data: updatedForm,
    });
  } catch (error: any) {
    console.error('Error updating form status:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update form status',
        message: error?.message,
      },
      { status: 500 }
    );
  }
}
