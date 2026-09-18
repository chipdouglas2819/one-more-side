# Google Play and ad policy for dice and slot themes

Research agent with web access, 2026-09-17. Every point cites a URL and a short quote. Not independently fact-checked beyond the agent's own fetches.

## Summary
Neither concept is blocked by Google Play or AdMob, but they sit in different risk tiers. A dice idle with virtual currency only and no cash-out falls entirely outside Play's Real-Money Gambling policy (which requires real money staked for real-world-value prizes) and, if the die stays a plain numbered die with deterministic face purchases, should not even trigger the IARC simulated-gambling descriptor — an E/Everyone-range rating is achievable. The slot reskin is the expensive one: it meets Google's own definition of a social casino game, triggers ESRB 'Simulated Gambling' (and likely 'Gambling Themes' from the visuals alone), pushing the rating to Teen/12+, and risks AdMob classifying the inventory as gambling-related, which measurably reduces or eliminates ad fill — the direct threat to a rewarded-ad business. The hard constraint on both is Play's Families policy, which flatly bans real or simulated gambling in child-targeted apps and judges your declared audience against your actual art; a cute-looking die is therefore a policy liability, not just a style choice. Loot-box odds disclosure only applies if randomized die faces are bought with money-derived currency, which is trivially avoided by keeping upgrades deterministic. Caveat: several quotes were extracted via page-summarization rather than raw HTML, so verify exact wording in Play Console before writing store-listing text.

## Implications for ONE MORE SIDE
- Bottom line: the dice version is policy-clean and the slot reskin is legal-but-taxed. Nothing here blocks either, but the slot version costs you a 12+/Teen rating, possible AdMob restricted-inventory classification, and Google Ads certification if you ever advertise it. Ship dice first; treat slot as a separate app listing, not an in-app mode.
- DICE — DO: sell die faces for a fixed, disclosed price in soft currency earned by rolling. Keep every upgrade deterministic (buy face N for X coins), so no loot-box odds disclosure is triggered at all. Answer the IARC questionnaire's gambling questions 'no' honestly — a numbered die with no casino framing is not simulating casino gambling.
- DICE — DO NOT: add a 'mystery face' or randomized upgrade crate purchasable with money-bought currency. If you ever do, you must show per-item odds before purchase, and it drags you toward gambling-themes territory for nothing.
- DICE — DO NOT: let coins be bought with real money AND converted out, redeemed, or gifted for anything of real value. As long as currency is one-way and terminal, the Real-Money Gambling policy never applies. Purchasing coins with real money is fine on its own.
- ART/AUDIENCE — DO: declare a 13+ target audience in Play Console and keep the art geometric/clean rather than cartoon-mascot cute. This keeps you out of Families policy scope, keeps all ad SDKs available, and avoids the Families ban on simulated-gambling ads inside your app. Do not opt in to Designed for Families.
- ART/AUDIENCE — DO NOT: use childlike characters, nursery colors, or 'for kids' wording anywhere in the listing. Google assesses your declared audience against your actual imagery, and a mismatch is a suspension ground, not just a rating correction.
- SLOT RESKIN — DO: build it as a separate Play listing sharing the engine. Declare simulated gambling truthfully in IARC (expect Teen/12+), add an in-app and listing disclaimer along the lines of 'no real-money gambling, no prizes of real-world value, intended for users of legal gambling age', and use abstract/original symbols.
- SLOT RESKIN — DO NOT: use real casino brand names, logos, or trade dress; do not add a 'cash out', sweepstakes, tournament-with-prize, or gift-card redemption feature — sweepstakes mechanics were specifically pulled out of the social-casino category and into full gambling rules. Do not run paid user acquisition for it without Google Ads social-casino certification.
- MONETIZATION — Expect rewarded-ad eCPM risk on the slot version if AdMob classifies the inventory as gambling-related. Validate this cheaply: ship dice first, measure real eCPM, then ship slot and compare before investing further in it.
- ENGINE SEAM — Keep the faces/symbols as pure data (labels + payout values) and the gambling-flavored presentation entirely in a theme layer. Then the slot build differs only by theme assets, store listing, IARC answers, and disclaimer strings — which is exactly the set of things policy cares about.

## Findings
- Google Play's Real-Money Gambling policy only bites when real money (or money-bought in-app items) is staked for a real-world-value prize. A dice/slot idle with virtual currency only and no cash-out is outside it.  
  Source: https://support.google.com/googleplay/android-developer/answer/9877032?hl=en  
  Quote: "wager, stake, or participate using real money (including in-app items purchased with money) to obtain a prize of real world monetary value"
- The same policy's examples are all money-in/prize-out. Neither concept qualifies as long as coins are never purchasable-for-cash AND redeemable.  
  Source: https://support.google.com/googleplay/android-developer/answer/9877032?hl=en  
  Quote: "Games that accept money in exchange for an opportunity to win a physical or monetary prize"
- Gambling apps proper must be AO-rated and age-gated. This is the bar you avoid entirely by having no wagering — but it is also what a mis-declared slot app risks being pushed toward.  
  Source: https://support.google.com/googleplay/android-developer/answer/9877032?hl=en  
  Quote: "must be rated AO (Adult Only) or IARC equivalent"
- Play's Families policy bans simulated gambling outright for child-targeted apps. This is the real constraint on the slot reskin, and on any dice art that reads as kid-friendly.  
  Source: https://support.google.com/googleplay/android-developer/answer/9893335?hl=en  
  Quote: "Apps that include real or simulated gambling"
- Families policy also bans ads for simulated gambling inside child-directed apps — relevant to rewarded-ad mediation if the target audience ever includes children.  
  Source: https://support.google.com/googleplay/android-developer/answer/9893335?hl=en  
  Quote: "Ads for simulated gambling, contests or sweepstakes promotions, even if free to enter"
- Art style and wording feed into Google's own assessment of the declared target audience — a cute cartoon die can drag you into Families scope even if you declare 13+.  
  Source: https://support.google.com/googleplay/android-developer/answer/9893335?hl=en  
  Quote: "imagery and terminology in your app that could be considered targeting children, this may impact Google Play's assessment of your declared target audience"
- If the target audience includes children at all, ad SDK choice is constrained — a practical reason to declare 13+ and keep the art non-childlike.  
  Source: https://support.google.com/googleplay/android-developer/answer/9893335?hl=en  
  Quote: "you must use only Families self-certified ads SDK versions"
- Misdeclaring the IARC questionnaire or target audience is itself a removal/suspension ground, so answering the simulated-gambling question honestly matters more than the rating it produces.  
  Source: https://support.google.com/googleplay/android-developer/answer/9859655  
  Quote: "Misrepresentation of your app's content may result in its removal or suspension"
- IARC consequence: declaring simulated gambling pushes the rating to roughly ESRB Teen / PEGI 12 / IARC 12+, which forecloses Designed for Families but is otherwise survivable.  
  Source: https://support.google.com/googleplay/android-developer/answer/9859655  
  Quote: "may contain...simulated gambling"
- ESRB's descriptor definition is the operative test for the questionnaire. A slot machine reskin triggers it; a plain numbered die almost certainly does not.  
  Source: https://www.esrb.org/ratings-guide/  
  Quote: "Player can gamble without betting or wagering real cash or currency. Typically assigned to simulations of casino-based gambling."
- There is a softer third descriptor that a slot reskin can land on even without simulating a wager — meaning casino visuals alone carry rating cost.  
  Source: https://www.esrb.org/ratings-guide/  
  Quote: "Prominently featured images or activities that are typically associated with real-world gambling even if they are not directly simulating a gambling experience"
- Simulated gambling is explicitly inside the ESRB Teen band, confirming the slot version is a 13+ product, not an E product.  
  Source: https://www.esrb.org/ratings-guide/  
  Quote: "generally appropriate for ages 13 and up, potentially including... simulated gambling"
- Google Ads' own definition of social casino matches the slot reskin exactly: simulated gambling-style with nothing of value to win.  
  Source: https://support.google.com/adspolicy/answer/15132179?hl=en  
  Quote: "Social casino games are online simulated gambling-style games where there is no opportunity to win something of value."
- Advertising a social casino game (i.e. user acquisition for the slot version) requires Google Ads certification and is limited to an allowlist of countries — a real barrier, though irrelevant if you do zero marketing.  
  Source: https://support.google.com/adspolicy/answer/15132179?hl=en  
  Quote: "The advertiser must hold a valid local license for distribution of their games in the targeted country, where applicable."
- Social casino ads must carry explicit disclaimers and must not target minors — the same disclaimers are cheap insurance inside the app's store listing.  
  Source: https://support.google.com/adspolicy/answer/15132179?hl=en  
  Quote: "Games must include a disclaimer that they are only intended for users over legal gambling age and must not target minors."
- Ads must not borrow real casino branding — rules out using recognisable slot brands, symbols or names in the reskin.  
  Source: https://support.google.com/adspolicy/answer/15132179?hl=en  
  Quote: "Ads, sites, or apps must not use logos, names, or marks associated with real-money gambling brands"
- On the publisher (AdMob) side, the restricted gambling category is defined by real money changing hands — a virtual-currency-only app should not be classified as restricted inventory.  
  Source: https://support.google.com/publisherpolicies/answer/10437795  
  Quote: "participate in online, real-money gambling or any internet-based game where money or other items of value are paid or wagered"
- But if inventory does get flagged as gambling-restricted, rewarded-ad revenue drops sharply — the concrete monetization risk of the slot skin.  
  Source: https://support.google.com/publisherpolicies/answer/10437795  
  Quote: "will likely receive less advertising than other, nonrestricted content"
- Worst case for restricted inventory is no fill at all, which would zero out the rewarded-ad model.  
  Source: https://support.google.com/publisherpolicies/answer/10437795  
  Quote: "no advertising sources are bidding on your inventory and no ads will appear on your content"
- Loot-box odds disclosure is a Play requirement and would apply if the player pays (real money or premium currency bought with money) for a randomized die face.  
  Source: https://www.fenwick.com/insights/publications/google-play-now-requires-disclosure-of-loot-box-odds  
  Quote: "must clearly disclose the odds of receiving those items in advance of purchase"
- Gamified randomized-reward systems must disclose both odds and selection method — a useful template even for a purely deterministic upgrade shop, and a reason to keep face purchases deterministic.  
  Source: https://support.google.com/googleplay/android-developer/answer/9877032?hl=en  
  Quote: "the odds for any reward programs which use fixed odds to determine rewards and 2) the selection method"