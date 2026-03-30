# 5 Elements Nodes

## Current State
Both "Supported Networks" and "Tested Networks" sections use rectangular cards with `rounded-2xl` styling. Cards contain a logo, network name, ticker (Supported only), and STAKE NOW button (Supported only).

## Requested Changes (Diff)

### Add
- `aspect-square` to force square dimensions on all network cards in both sections

### Modify
- Card container: change `rounded-2xl` to `rounded-full` for both Supported and Tested Networks cards
- Add `items-center justify-center` to card flex layout so content is centered inside the circle
- Reduce logo container size slightly (w-12 h-12) and make logo container `rounded-full` to match
- Reduce internal padding to fit content inside the circular shape
- Tighten spacing between card elements (smaller mb/gap values)
- STAKE NOW button: keep but reduce size further (font-size, padding) to fit within the circle

### Remove
- Nothing removed

## Implementation Plan
1. In the Supported Networks section: update each `motion.div` card to use `rounded-full aspect-square` and `flex flex-col items-center justify-center`, tighten internal spacing
2. In the Tested Networks section: same circular treatment
3. Logo container in both: change to `rounded-full` with slightly smaller dimensions
4. Validate and build
