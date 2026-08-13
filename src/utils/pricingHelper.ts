import { Medicine } from '../types';

export interface MedicinePricingResult {
  hasPrice: boolean;
  unitPrice: number;
  unitDiscountPrice: number;
  unitLabel: string;
  unitSubtext: string;
  
  // Pack details
  hasSeparatePack: boolean;
  packLabel: string;
  packCount: number;
  packPrice: number;
  packDiscountPrice: number;
  isSingleContainer: boolean;
}

/**
 * Calculates clinically and commercially accurate pricing for Bangladeshi pharmaceuticals.
 * Handles different dosage forms (tablets, capsules, syrups, suspensions, eye drops, ointments, inhalers, injections).
 */
export function calculateMedicinePricing(medicine: Medicine): MedicinePricingResult {
  const mrp = Number(medicine.mrp) > 0 ? Number(medicine.mrp) : 0;
  const hasPrice = mrp > 0;
  const form = (medicine.form || '').toLowerCase().trim();
  const rawPackSize = (medicine.packSize || '').trim();

  // Dosage form classification
  const isLiquid = /syrup|suspension|oral solution|solution|oral drops|elixir|linctus|fluid|saline|infusion|dialysis/i.test(form);
  const isEyeEarDrop = /eye drops|ear drops|ophthalmic|otic|eye\/ear/i.test(form);
  const isTopical = /cream|ointment|gel|lotion|paste|shampoo|mouthwash|toothpaste|antiseptic|irrigator|emollient/i.test(form);
  const isInhalerDevice = /inhaler|respirator|spray|nasal|rotacap|rotahaler|aerosol|inhalation/i.test(form);
  const isInjection = /injection|iv|ampoule|vial|im injection|iv\/im/i.test(form);
  const isDiscreteUnit = /tablet|capsule|caplet|chewable|suppository|pessary|sachet|pellet|wafer|lozenge|dispersible|mups/i.test(form);

  // 1. Determine Unit Labels & Subtext
  let unitLabel = 'Unit Price :';
  let unitSubtext = 'Per Unit';

  if (isLiquid) {
    unitLabel = 'Bottle Price :';
    unitSubtext = rawPackSize ? `Per ${rawPackSize}` : 'Per Bottle';
  } else if (isEyeEarDrop) {
    unitLabel = 'Dropper Price :';
    unitSubtext = rawPackSize ? `Per ${rawPackSize}` : 'Per Dropper Bottle';
  } else if (isTopical) {
    unitLabel = 'Tube / Pack Price :';
    unitSubtext = rawPackSize ? `Per ${rawPackSize}` : 'Per Tube';
  } else if (isInhalerDevice) {
    unitLabel = 'Device / Unit Price :';
    unitSubtext = rawPackSize ? `Per ${rawPackSize}` : 'Per Unit Device';
  } else if (isInjection) {
    unitLabel = 'Vial / Ampoule Price :';
    unitSubtext = 'Per Vial / Ampoule';
  } else if (/tablet|caplet|chewable|dispersible/i.test(form)) {
    unitLabel = 'Unit Price :';
    unitSubtext = 'Per Tablet (১টি ট্যাবলেট)';
  } else if (/capsule|softgel/i.test(form)) {
    unitLabel = 'Unit Price :';
    unitSubtext = 'Per Capsule (১টি ক্যাপসুল)';
  } else if (/suppository|pessary/i.test(form)) {
    unitLabel = 'Unit Price :';
    unitSubtext = 'Per Suppository (১টি সাপোজিটরি)';
  } else if (/sachet/i.test(form)) {
    unitLabel = 'Unit Price :';
    unitSubtext = 'Per Sachet (১টি স্যাচেট)';
  }

  // 2. Parse Multi-Pack Count & Pack Labels
  let packCount = 1;
  let packLabel = rawPackSize || '1 Unit';
  let hasSeparatePack = false;
  let isSingleContainer = false;

  if (isLiquid || isEyeEarDrop || isTopical || isInhalerDevice) {
    // Check if it is a multi-pack of bottles/tubes/vials, e.g., "5 Vials", "3 Tubes", "2 x 100ml"
    const multiPackMatch = rawPackSize.match(/^(\d+)\s*(?:vials?|ampoules?|tubes?|bottles?|pack|units?)/i);
    const multiXMatch = rawPackSize.match(/^(\d+)\s*[xX*]\s*(\d+)/);

    if (multiXMatch) {
      packCount = parseInt(multiXMatch[1], 10) * parseInt(multiXMatch[2], 10);
      hasSeparatePack = packCount > 1;
      packLabel = rawPackSize;
    } else if (multiPackMatch && !/ml|gm|gram|dose/i.test(multiPackMatch[0])) {
      packCount = parseInt(multiPackMatch[1], 10);
      hasSeparatePack = packCount > 1;
      packLabel = rawPackSize;
    } else {
      // It's a single container product (e.g. "100ml bot", "10gm tube", "5ml drop", "120 doses unit", "1's pack", "")
      packCount = 1;
      hasSeparatePack = false;
      isSingleContainer = true;
      packLabel = rawPackSize || 'Single Unit Pack';
    }
  } else if (isInjection) {
    // Injections often have "5's pack", "10's pack", "5 Vials", "10 Ampoules", "1's pack"
    const multiInj = rawPackSize.match(/(\d+)\s*(?:['’]s|vials?|ampoules?|pack)/i);
    if (multiInj) {
      packCount = parseInt(multiInj[1], 10);
      hasSeparatePack = packCount > 1;
      packLabel = rawPackSize;
    } else {
      packCount = 1;
      hasSeparatePack = false;
      packLabel = rawPackSize || '1 Vial / Ampoule';
    }
  } else if (isDiscreteUnit) {
    // Discrete solid units (Tablets, Capsules, Suppositories, Sachets)
    const multiplierMatch = rawPackSize.match(/(\d+)\s*[xX*]\s*(\d+)/);
    const countMatch = rawPackSize.match(/(\d+)\s*['’]s/i) || rawPackSize.match(/^(\d+)\s*(?:pack|tablets?|capsules?|suppositories?|strips?)/i);

    if (multiplierMatch) {
      const n1 = parseInt(multiplierMatch[1], 10);
      const n2 = parseInt(multiplierMatch[2], 10);
      packCount = n1 * n2;
      hasSeparatePack = packCount > 1;
      packLabel = rawPackSize;
    } else if (countMatch) {
      packCount = parseInt(countMatch[1], 10);
      hasSeparatePack = packCount > 1;
      packLabel = rawPackSize;
    } else if (rawPackSize.includes("'")) {
      const numMatch = rawPackSize.match(/\d+/);
      if (numMatch) {
        packCount = parseInt(numMatch[0], 10);
        hasSeparatePack = packCount > 1;
        packLabel = rawPackSize;
      }
    } else if (!rawPackSize) {
      // Empty pack size for tablets/capsules: Show standard strip price (10's strip)
      packCount = 10;
      hasSeparatePack = true;
      packLabel = "10's Strip (Standard)";
    } else {
      packCount = 1;
      hasSeparatePack = false;
      packLabel = rawPackSize;
    }
  }

  const unitPrice = mrp;
  const unitDiscountPrice = unitPrice > 0 ? unitPrice * 0.90 : 0;

  const packPrice = hasSeparatePack ? unitPrice * packCount : unitPrice;
  const packDiscountPrice = packPrice > 0 ? packPrice * 0.90 : 0;

  return {
    hasPrice,
    unitPrice,
    unitDiscountPrice,
    unitLabel,
    unitSubtext,
    hasSeparatePack,
    packLabel,
    packCount,
    packPrice,
    packDiscountPrice,
    isSingleContainer
  };
}
