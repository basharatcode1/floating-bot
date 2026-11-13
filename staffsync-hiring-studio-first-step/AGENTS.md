<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- JD/AI behaviour lives behind `src/lib/jd/demo-service.ts` (local, labeled demo logic); swap its functions for server functions to connect real AI/parsing/publishing — keeps UI unchanged and never fakes backend success.
- Keep the requirements entry-path type aligned with its choice cards and conditional views; removed entry paths must not remain reachable through editor actions.
- Mount the intro GLB scene through a lazy ClientOnly boundary; normalize the asset once and keep frame motion outside React so SSR and both hiring flows stay independent of WebGL.
- Keep welcome timing in a pure module, start it after the model's ready signal, and retain completion in the Requirements page; returning from a hiring flow must not replay, while a fresh route entry starts anew. Projected pocket-to-card offsets belong to the separate UI layer, not articulated model gestures.
- Adapt mascot mesh siblings through shoulder/wrist pivot groups and a helmet-only cloned visor texture; never mutate cached GLB geometry or shared materials. Gesture math remains pure and reduced motion freezes joints and expressions.
- In development only, `?mascot-time=<seconds>` freezes greeting gesture/expression timing for browser inspection; reduced-motion still takes priority.
- Preload the lightweight robot poster on the requirements list and paint the popup before mounting its lazy 3D scene using a cancellable paint boundary; never block opening on WebGL readiness or wait for the full intro. The 3D robot waves on its own clock when it appears; typing is time-based.
- Keep the screenshot-based requirements list at `/client/requirements` and the existing builder at `/client/requirements/new` using an un-nested route; screenshot records are local reference data, not published or saved requirements.
- The hiring builder lives in RequirementBuilder (embedded prop drops page chrome); Post Requirement opens it in a single-scroll modal, and /client/requirements/new reuses it standalone.
