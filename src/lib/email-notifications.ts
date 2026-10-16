import { IntakeRecord, LeadRecord } from "@/lib/db";

const RESEND_API_URL = "https://api.resend.com/emails";

function getRecipientList(): string[] {
  const raw = process.env.LEAD_NOTIFICATION_EMAIL || "bankruptcy@ringgerlaw.com";
  return raw
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);
}

async function sendResendEmail(payload: {
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return;
  }

  const to = getRecipientList();
  const candidateSenders = process.env.RESEND_FROM_EMAIL
    ? [process.env.RESEND_FROM_EMAIL]
    : [
        "Ringger Law Lead Alerts <leads@alerts.ringgerlaw.com>",
        "Ringger Law Lead Alerts <leads@mail.ringgerlaw.com>",
        "Ringger Law Lead Alerts <leads@ringgerlaw.com>",
        "Ringger Law Lead Alerts <onboarding@resend.dev>",
      ];

  try {
    for (const fromAddress of candidateSenders) {
      const res = await fetch(RESEND_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromAddress,
          to,
          reply_to: payload.replyTo || undefined,
          subject: payload.subject,
          html: payload.html,
        }),
      });
      if (res.ok) {
        break;
      }
    }
  } catch (err) {
    console.error("Failed to send Resend email notification:", err);
  }
}

export async function sendNewLeadNotification(lead: LeadRecord): Promise<void> {
  const fullName = `${lead.firstName} ${lead.lastName || ""}`.trim();
  const isEmergency = lead.urgency === "EMERGENCY_FORECLOSURE_REPO";
  const isGarnishment = lead.urgency === "WAGE_GARNISHMENT";

  const urgencyBadge = isEmergency
    ? "🚨 URGENT FORECLOSURE / REPO LEAD"
    : isGarnishment
    ? "⚠️ 25% WAGE GARNISHMENT LEAD"
    : "✅ NEW BANKRUPTCY CONSULTATION LEAD";

  const subject = `${isEmergency ? "🚨 URGENT: " : "⚖️ New Lead: "}${fullName} — ${lead.primaryConcern} (${lead.county})`;
  const cleanPhone = (lead.phone || "").replace(/\D/g, "");

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; max-width: 620px; margin: 0 auto; background: #0B1324; color: #F8FAFC; border-radius: 16px; overflow: hidden; border: 2px solid #D4AF37;">
      <div style="background: linear-gradient(90deg, #A8E028 0%, #D4AF37 100%); height: 8px;"></div>
      <div style="padding: 28px;">
        <div style="font-size: 12px; font-weight: 800; color: #A8E028; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 6px;">
          ${urgencyBadge}
        </div>
        <h1 style="margin: 0 0 8px 0; font-size: 24px; color: #FFFFFF;">
          ${fullName}
        </h1>
        <p style="margin: 0 0 20px 0; font-size: 14px; color: #CBD5E1;">
          Captured via <strong>${lead.captureMethod}</strong> on <code>${lead.sourcePage}</code>
        </p>

        ${
          cleanPhone
            ? `<div style="margin-bottom: 24px;">
                <a href="tel:${cleanPhone}" style="display: inline-block; background: #A8E028; color: #060B14; font-weight: 900; font-size: 16px; text-decoration: none; padding: 14px 24px; border-radius: 12px; margin-right: 10px;">
                  📞 Call ${lead.phone} Now
                </a>
                <a href="https://www.ringgerlaw.com/admin" style="display: inline-block; background: #1E293B; color: #F5D76E; border: 1px solid #D4AF37; font-weight: 800; font-size: 15px; text-decoration: none; padding: 13px 20px; border-radius: 12px;">
                  🔒 Open Admin Portal →
                </a>
              </div>`
            : ""
        }

        <table style="width: 100%; border-collapse: collapse; background: #131F36; border-radius: 12px; overflow: hidden; font-size: 14px;">
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
            <td style="padding: 12px 16px; color: #94A3B8; font-weight: 600; width: 40%;">Client Name</td>
            <td style="padding: 12px 16px; color: #FFFFFF; font-weight: 800;">${fullName}</td>
          </tr>
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
            <td style="padding: 12px 16px; color: #94A3B8; font-weight: 600;">Phone Number</td>
            <td style="padding: 12px 16px; color: #A8E028; font-weight: 800;">${lead.phone || "Not provided"}</td>
          </tr>
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
            <td style="padding: 12px 16px; color: #94A3B8; font-weight: 600;">Email Address</td>
            <td style="padding: 12px 16px; color: #FFFFFF;">${lead.email || "Not provided"}</td>
          </tr>
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
            <td style="padding: 12px 16px; color: #94A3B8; font-weight: 600;">West TN County</td>
            <td style="padding: 12px 16px; color: #FFFFFF; font-weight: 700;">${lead.county}</td>
          </tr>
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
            <td style="padding: 12px 16px; color: #94A3B8; font-weight: 600;">Primary Debt Concern</td>
            <td style="padding: 12px 16px; color: #F5D76E; font-weight: 800;">${lead.primaryConcern}</td>
          </tr>
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
            <td style="padding: 12px 16px; color: #94A3B8; font-weight: 600;">Recommended Chapter</td>
            <td style="padding: 12px 16px; color: #FFFFFF; font-weight: 700;">${lead.recommendedChapter}</td>
          </tr>
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
            <td style="padding: 12px 16px; color: #94A3B8; font-weight: 600;">Estimated Unsecured Debt</td>
            <td style="padding: 12px 16px; color: #FFFFFF;">$${(lead.estimatedDebt || 0).toLocaleString()}</td>
          </tr>
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
            <td style="padding: 12px 16px; color: #94A3B8; font-weight: 600;">Homeowner / Behind on Payments</td>
            <td style="padding: 12px 16px; color: #FFFFFF;">
              Owns Home: <strong>${lead.ownsHome ? "Yes" : "No"}</strong> • Behind: <strong>${lead.behindOnPayments ? "Yes" : "No"}</strong>
            </td>
          </tr>
          ${
            lead.preferredDate || lead.preferredTime
              ? `<tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
                  <td style="padding: 12px 16px; color: #94A3B8; font-weight: 600;">Requested Consult Slot</td>
                  <td style="padding: 12px 16px; color: #A8E028; font-weight: 700;">${lead.preferredDate || ""} ${lead.preferredTime || ""}</td>
                </tr>`
              : ""
          }
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
            <td style="padding: 12px 16px; color: #94A3B8; font-weight: 600;">Traffic Attribution Source</td>
            <td style="padding: 12px 16px; color: #38BDF8; font-weight: 700;">
              ${lead.trafficSourceLabel || lead.trafficChannel || "Direct Visit"}
              ${lead.clickId ? ` (GCLID: ${lead.clickId})` : ""}
            </td>
          </tr>
          ${
            lead.notes
              ? `<tr>
                  <td style="padding: 12px 16px; color: #94A3B8; font-weight: 600;">Client Notes</td>
                  <td style="padding: 12px 16px; color: #E2E8F0;">${lead.notes}</td>
                </tr>`
              : ""
          }
        </table>

        <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.1); font-size: 12px; color: #94A3B8;">
          Ringger Law Automated Lead Triage • <a href="https://www.ringgerlaw.com/admin" style="color: #A8E028;">ringgerlaw.com/admin</a>
        </div>
      </div>
    </div>
  `;

  await sendResendEmail({
    subject,
    html,
    replyTo: lead.email || undefined,
  });
}

export async function sendNewIntakeNotification(intake: IntakeRecord): Promise<void> {
  const subject = `📋 Signed 5-Step Court Intake Packet: ${intake.fullName}`;
  const cleanPhone = (intake.phone || "").replace(/\D/g, "");

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; max-width: 620px; margin: 0 auto; background: #0B1324; color: #F8FAFC; border-radius: 16px; overflow: hidden; border: 2px solid #A8E028;">
      <div style="background: linear-gradient(90deg, #A8E028 0%, #D4AF37 100%); height: 8px;"></div>
      <div style="padding: 28px;">
        <div style="font-size: 12px; font-weight: 800; color: #A8E028; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 6px;">
          📋 SIGNED 5-STEP COURT INTAKE WORKSHEET
        </div>
        <h1 style="margin: 0 0 8px 0; font-size: 24px; color: #FFFFFF;">
          ${intake.fullName}
        </h1>
        <p style="margin: 0 0 20px 0; font-size: 14px; color: #CBD5E1;">
          Electronically signed by <strong>${intake.debtorSignature}</strong> on ${intake.signatureDate}
        </p>

        <div style="margin-bottom: 24px;">
          ${
            cleanPhone
              ? `<a href="tel:${cleanPhone}" style="display: inline-block; background: #A8E028; color: #060B14; font-weight: 900; font-size: 16px; text-decoration: none; padding: 14px 24px; border-radius: 12px; margin-right: 10px;">
                  📞 Call ${intake.phone}
                </a>`
              : ""
          }
          <a href="https://www.ringgerlaw.com/admin" style="display: inline-block; background: #1E293B; color: #F5D76E; border: 1px solid #D4AF37; font-weight: 800; font-size: 15px; text-decoration: none; padding: 13px 20px; border-radius: 12px;">
            🖨️ View &amp; Print Full Court Packet in Admin →
          </a>
        </div>

        <table style="width: 100%; border-collapse: collapse; background: #131F36; border-radius: 12px; overflow: hidden; font-size: 14px;">
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
            <td style="padding: 12px 16px; color: #94A3B8; font-weight: 600; width: 40%;">Full Name</td>
            <td style="padding: 12px 16px; color: #FFFFFF; font-weight: 800;">${intake.fullName}</td>
          </tr>
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
            <td style="padding: 12px 16px; color: #94A3B8; font-weight: 600;">Phone / Email</td>
            <td style="padding: 12px 16px; color: #A8E028; font-weight: 700;">${intake.phone} • ${intake.email}</td>
          </tr>
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
            <td style="padding: 12px 16px; color: #94A3B8; font-weight: 600;">Mailing Address</td>
            <td style="padding: 12px 16px; color: #FFFFFF;">${intake.mailingAddress}</td>
          </tr>
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
            <td style="padding: 12px 16px; color: #94A3B8; font-weight: 600;">Gross Monthly Income</td>
            <td style="padding: 12px 16px; color: #FFFFFF; font-weight: 700;">${intake.grossMonthlyIncome} (${intake.payFrequency})</td>
          </tr>
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
            <td style="padding: 12px 16px; color: #94A3B8; font-weight: 600;">Real Estate / Foreclosure Notice</td>
            <td style="padding: 12px 16px; color: #F5D76E; font-weight: 700;">
              ${intake.realEstateOwned || "None"} • Foreclosure Notice: ${intake.receivedForeclosureNotice ? "YES" : "No"}
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 16px; color: #94A3B8; font-weight: 600;">Vehicles Owned</td>
            <td style="padding: 12px 16px; color: #FFFFFF;">${intake.vehiclesOwned || "None"}</td>
          </tr>
        </table>
      </div>
    </div>
  `;

  await sendResendEmail({
    subject,
    html,
    replyTo: intake.email || undefined,
  });
}
