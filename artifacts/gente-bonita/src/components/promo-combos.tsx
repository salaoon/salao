import { useCombos, useSiteConfig } from '@/hooks/use-site-data';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';

const WHATSAPP_NUMBER = '5566984165461';

export default function PromoCombos() {
  const { data: combos } = useCombos();
  const { data: config } = useSiteConfig();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const isVisible = config?.combosVisiveis === 'true';
  const whatsappNumber = config?.whatsappNumber || WHATSAPP_NUMBER;
  const activeCombos = combos?.filter((c: any) => c.ativo !== false) || [];

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const update = () => {
      setCanScrollLeft(el.scrollLeft > 0);
      setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
    };
    update();
    el.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      el.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [activeCombos.length]);

  if (!isVisible || activeCombos.length === 0) return null;

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.querySelector<HTMLElement>('[data-combo-card]')?.offsetWidth || 400;
    el.scrollBy({ left: dir === 'left' ? -cardWidth - 16 : cardWidth + 16, behavior: 'smooth' });
  };

  return (
    <section className="scroll-mt-6 bg-[#100c10] py-16 md:py-20">
      <div className="gb-shell">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end gb-reveal">
          <div className="max-w-xl">
            <p className="gb-eyebrow mb-5">Promoções</p>
            <h2 className="gb-display text-4xl leading-[.98] text-[#f9eee7] md:text-6xl">
              Combos<br /><em className="text-[#df9587]">especiais.</em>
            </h2>
            <p className="gb-muted mt-6 max-w-lg text-[15px] leading-7">
              Aproveite nossas ofertas exclusivas. Toque no combo que te interessa e fale conosco.
            </p>
          </div>

          {activeCombos.length > 1 && (
            <div className="flex gap-2 shrink-0">
              <button
                type="button"
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#f9eee7]/20 text-[#f9eee7] transition-colors hover:border-[#df9587] hover:text-[#df9587] disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Combo anterior"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#f9eee7]/20 text-[#f9eee7] transition-colors hover:border-[#df9587] hover:text-[#df9587] disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Próximo combo"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>

        <div
          ref={scrollRef}
          className="mt-10 flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 gb-reveal gb-reveal-delay"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {activeCombos.map((combo: any) => {
            const msg = encodeURIComponent(
              `Olá! Tenho interesse no combo: *${combo.titulo}*.\n${combo.descricao}`
            );
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${msg}`;

            return (
              <div
                key={combo.id}
                data-combo-card
                className="flex-none w-[85vw] max-w-[520px] snap-start rounded-lg border border-[#f9eee7]/10 bg-[#080709] overflow-hidden flex flex-col md:flex-row"
              >
                {combo.imagem_url && (
                  <div className="md:w-[45%] h-48 md:h-auto shrink-0 overflow-hidden">
                    <img
                      src={combo.imagem_url}
                      alt={combo.titulo}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}

                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    <h3 className="text-xl font-light text-[#f9eee7] leading-tight">
                      {combo.titulo}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-[#b9a4a0] whitespace-pre-line">
                      {combo.descricao}
                    </p>
                  </div>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="gb-button mt-6 w-full justify-center border-[#df9587] text-[#df9587] hover:bg-[#df9587] hover:text-[#080709]"
                  >
                    Quero esse combo <ArrowUpRight size={16} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
