import { useEffect, useState } from 'react';

import { useLocation } from 'wouter';

import { supabase } from '@/lib/supabase';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { Button } from '@/components/ui/button';

import { Input } from '@/components/ui/input';

import { Label } from '@/components/ui/label';

import { Textarea } from '@/components/ui/textarea';

import { LogOut, Save, Plus, Trash2, Eye, EyeOff, Image, ToggleLeft, ToggleRight } from 'lucide-react';

import { useToast } from '@/hooks/use-toast';

import { useSiteConfig, useServices, useGallery, useCombos } from '@/hooks/use-site-data';




function SitePhotosManager() {
  const { toast } = useToast();
  const { data: config, refetch } = useSiteConfig();
  
  const handleUpload = async (key: string, file: File) => {
    try {
      const ext = file.name.split('.').pop();
      const filename = `${key}-${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from('fotos').upload(filename, file);
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage.from('fotos').getPublicUrl(filename);
      
      const { error: dbError } = await supabase.from('configuracoes').upsert({ id: key, valor: urlData.publicUrl });
      if (dbError) throw dbError;
      
      toast({ title: 'Foto atualizada com sucesso!' });
      refetch();
    } catch (err) {
      console.error(err);
      toast({ title: 'Erro ao enviar foto', variant: 'destructive' });
    }
  };

  return (
    <div className="bg-[#111014] p-6 rounded-lg border border-[#f9eee7]/15 mt-8">
      <h2 className="text-xl mb-4 text-[#df9587]">Fotos Principais</h2>
      <p className="text-sm text-[#a99594] mb-6">Altere a Foto da Hero, do Mega Hair e dos Cílios.</p>
      
      <div className="grid gap-8 md:grid-cols-3">
        <div>
          <Label className="text-[#d1bbb6] mb-2 block">Foto da Hero</Label>
          <Input type="file" accept="image/png, image/jpeg" className="bg-[#080709] border-[#f9eee7]/20 text-[#f9eee7] cursor-pointer" onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleUpload('heroImage', file);
          }} />
          {config?.heroImage && <img src={config.heroImage} alt="Hero" className="mt-3 h-32 w-auto rounded border border-[#f9eee7]/20 object-cover" />}
        </div>
        
        <div>
          <Label className="text-[#d1bbb6] mb-2 block">Foto do Mega Hair</Label>
          <Input type="file" accept="image/png, image/jpeg" className="bg-[#080709] border-[#f9eee7]/20 text-[#f9eee7] cursor-pointer" onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleUpload('megaHairImage', file);
          }} />
          {config?.megaHairImage && <img src={config.megaHairImage} alt="Mega Hair" className="mt-3 h-32 w-auto rounded border border-[#f9eee7]/20 object-cover" />}
        </div>

        <div>
          <Label className="text-[#d1bbb6] mb-2 block">Foto dos Cílios</Label>
          <Input type="file" accept="image/png, image/jpeg" className="bg-[#080709] border-[#f9eee7]/20 text-[#f9eee7] cursor-pointer" onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleUpload('ciliosImage', file);
          }} />
          {config?.ciliosImage && <img src={config.ciliosImage} alt="Cílios" className="mt-3 h-32 w-auto rounded border border-[#f9eee7]/20 object-cover" />}
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {

  const [, setLocation] = useLocation();

  const { toast } = useToast();

  const [loading, setLoading] = useState(true);



  const configQuery = useSiteConfig();

  const servicesQuery = useServices();

  const combosQuery = useCombos();

  useEffect(() => {

    supabase.auth.getSession().then(({ data: { session } }) => {

      if (!session) {

        setLocation('/admin/login');

      }

      setLoading(false);

    });



    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {

      if (event === 'SIGNED_OUT') {

        // Redireciona para a Home ao sair

        setLocation('/');

      } else if (!session) {

        setLocation('/admin/login');

      }

    });



    return () => subscription.unsubscribe();

  }, [setLocation]);



  const handleLogout = async () => {

    await supabase.auth.signOut();

  };



  if (loading) {

    return <div className="min-h-screen flex items-center justify-center bg-[#080709] text-[#f9eee7]">Carregando...</div>;

  }



  return (

    <div className="min-h-screen bg-[#080709] text-[#f9eee7] p-6 md:p-12">

      <div className="max-w-5xl mx-auto space-y-8">

        <header className="flex items-center justify-between border-b border-[#f9eee7]/15 pb-6">

          <div>

            <h1 className="text-3xl font-light text-[#df9587]">Painel Administrativo</h1>

            <p className="text-sm text-[#a99594] mt-1">Gerencie os conteúdos e fotos do site</p>

          </div>

          <Button variant="outline" onClick={handleLogout} className="border-[#f9eee7]/20 hover:bg-[#111014] text-[#f9eee7]">

            <LogOut className="mr-2 h-4 w-4" /> Voltar para o Site

          </Button>

        </header>



        <Tabs defaultValue="geral" className="w-full">

          <TabsList className="bg-[#111014] border border-[#f9eee7]/15">

            <TabsTrigger value="geral">Textos Gerais</TabsTrigger>

            <TabsTrigger value="servicos">Serviços</TabsTrigger>

            <TabsTrigger value="galeria">Galeria</TabsTrigger>

            <TabsTrigger value="combos">Combos</TabsTrigger>          </TabsList>



          <TabsContent value="geral" className="mt-6">

            <div className="bg-[#111014] p-6 rounded-lg border border-[#f9eee7]/15">

              <h2 className="text-xl mb-4 text-[#df9587]">Configurações Gerais</h2>

              {configQuery.isLoading ? (

                <p>Carregando configurações...</p>

              ) : (

                <ConfigForm initialData={configQuery.data || {}} onSuccess={() => configQuery.refetch()} />

              )}

            </div>

          </TabsContent>



          <TabsContent value="servicos" className="mt-6">

            <div className="bg-[#111014] p-6 rounded-lg border border-[#f9eee7]/15">

              <div className="flex items-center justify-between mb-4">

                <h2 className="text-xl text-[#df9587]">Serviços Oferecidos</h2>

              </div>

              {servicesQuery.isLoading ? (

                <p>Carregando serviços...</p>

              ) : (

                <ServicesList services={servicesQuery.data || []} onSuccess={() => servicesQuery.refetch()} />

              )}

            </div>

          </TabsContent>

          

          <TabsContent value="galeria" className="mt-6">

            <div className="bg-[#111014] p-6 rounded-lg border border-[#f9eee7]/15">

              <div className="flex items-center justify-between mb-4">

                <h2 className="text-xl text-[#df9587]">Galeria de Fotos</h2>

              </div>

              <GalleryManager />

            </div>

            <SitePhotosManager />

          </TabsContent>

          <TabsContent value="combos" className="mt-6">

            <div className="bg-[#111014] p-6 rounded-lg border border-[#f9eee7]/15">

              <div className="flex items-center justify-between mb-4">

                <h2 className="text-xl text-[#df9587]">Combos Promocionais</h2>

              </div>

              <CombosManager config={configQuery.data || {}} combos={combosQuery.data || []} onSuccess={() => { configQuery.refetch(); combosQuery.refetch(); }} />

            </div>

          </TabsContent>

        </Tabs>

      </div>

    </div>

  );

}



function ConfigForm({ initialData, onSuccess }: { initialData: Record<string, string>, onSuccess: () => void }) {

  const { toast } = useToast();

  const [data, setData] = useState(initialData);

  const [saving, setSaving] = useState(false);



  const handleChange = (id: string, value: string) => setData(curr => ({ ...curr, [id]: value }));



  const handleSave = async () => {

    setSaving(true);

    const promises = Object.entries(data).map(([id, valor]) => {

      return supabase.from('configuracoes').upsert({ id, valor });

    });

    

    await Promise.all(promises);

    setSaving(false);

    toast({ title: 'Configurações salvas com sucesso!' });

    onSuccess();

  };



  return (

    <div className="space-y-4">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div><Label className="text-[#d1bbb6]">WhatsApp Número</Label><Input className="bg-[#080709] border-[#f9eee7]/20 text-[#f9eee7]" value={data.whatsappNumber || ''} onChange={e => handleChange('whatsappNumber', e.target.value)} /></div>

        <div><Label className="text-[#d1bbb6]">WhatsApp Rótulo</Label><Input className="bg-[#080709] border-[#f9eee7]/20 text-[#f9eee7]" value={data.whatsappLabel || ''} onChange={e => handleChange('whatsappLabel', e.target.value)} /></div>

        <div><Label className="text-[#d1bbb6]">Instagram (@)</Label><Input className="bg-[#080709] border-[#f9eee7]/20 text-[#f9eee7]" value={data.instagramHandle || ''} onChange={e => handleChange('instagramHandle', e.target.value)} /></div>

        <div><Label className="text-[#d1bbb6]">Instagram Link</Label><Input className="bg-[#080709] border-[#f9eee7]/20 text-[#f9eee7]" value={data.instagramUrl || ''} onChange={e => handleChange('instagramUrl', e.target.value)} /></div>

        <div className="md:col-span-2"><Label className="text-[#d1bbb6]">Endereço</Label><Input className="bg-[#080709] border-[#f9eee7]/20 text-[#f9eee7]" value={data.address || ''} onChange={e => handleChange('address', e.target.value)} /></div>

        <div className="md:col-span-2"><Label className="text-[#d1bbb6]">Link Google Maps</Label><Input className="bg-[#080709] border-[#f9eee7]/20 text-[#f9eee7]" value={data.mapsUrl || ''} onChange={e => handleChange('mapsUrl', e.target.value)} /></div>

        <div className="md:col-span-2"><Label className="text-[#d1bbb6]">Horários</Label><Input className="bg-[#080709] border-[#f9eee7]/20 text-[#f9eee7]" value={data.hours || ''} onChange={e => handleChange('hours', e.target.value)} /></div>

        

        <div className="md:col-span-2"><Label className="text-[#d1bbb6]">Tí­tulo Principal (Início)</Label><Input className="bg-[#080709] border-[#f9eee7]/20 text-[#f9eee7]" value={data.heroTitle || ''} onChange={e => handleChange('heroTitle', e.target.value)} /></div>

        <div className="md:col-span-2"><Label className="text-[#d1bbb6]">Sobre nós - Parágrafo 1</Label><Textarea className="bg-[#080709] border-[#f9eee7]/20 text-[#f9eee7] min-h-[80px]" value={data.aboutText1 || ''} onChange={e => handleChange('aboutText1', e.target.value)} /></div>

        <div className="md:col-span-2"><Label className="text-[#d1bbb6]">Sobre nós - Parágrafo 2</Label><Textarea className="bg-[#080709] border-[#f9eee7]/20 text-[#f9eee7] min-h-[80px]" value={data.aboutText2 || ''} onChange={e => handleChange('aboutText2', e.target.value)} /></div>

      </div>

      <Button onClick={handleSave} disabled={saving} className="bg-[#d68c80] text-[#24161d] hover:bg-[#df9587]">

        <Save className="mr-2 h-4 w-4" /> {saving ? 'Salvando...' : 'Salvar Configurações'}

      </Button>

    </div>

  );

}



function ServicesList({ services, onSuccess }: { services: any[], onSuccess: () => void }) {

  const { toast } = useToast();

  const [data, setData] = useState(services);

  const [saving, setSaving] = useState(false);



  useEffect(() => {

    setData(services);

  }, [services]);



  const handleChange = (index: number, field: string, value: any) => {

    const updated = [...data];

    updated[index] = { ...updated[index], [field]: value };

    setData(updated);

  };



  const handleAdd = () => {

    setData([...data, { titulo: '', detalhe: '', descricao: '', icone: 'Sparkles', numero: String(data.length + 1).padStart(2, '0'), ativo: true, ordem: data.length + 1 }]);

  };



  const handleDelete = async (index: number, id?: string) => {

    if (!confirm('Tem certeza que deseja excluir este serviço?')) return;

    

    if (id) {

      await supabase.from('servicos').delete().eq('id', id);

    }

    

    const updated = [...data];

    updated.splice(index, 1);

    setData(updated);

    toast({ title: 'Serviço removido.' });

    if (id) onSuccess();

  };



  const handleSave = async () => {

    setSaving(true);

    const promises = data.map(service => {
      // Create a clean payload without 'ativo' since it doesn't exist in the DB schema
      const { id, ativo, ...cleanService } = service;

      if (!id) {
        return supabase.from('servicos').insert(cleanService);
      }
      return supabase.from('servicos').update(cleanService).eq('id', id);
    });

    const results = await Promise.all(promises);
    const errors = results.filter(r => r.error).map(r => r.error);
    if (errors.length > 0) {
      console.error(errors);
      toast({ title: 'Erro ao salvar', description: errors[0]?.message, variant: 'destructive' });
      setSaving(false);
      return;
    }

    setSaving(false);

    toast({ title: 'Serviços salvos com sucesso!' });

    onSuccess();

  };



  return (

    <div className="space-y-6">

      {data.map((service, idx) => (

        <div key={service.id || `new-${idx}`} className={`p-4 border ${service.ativo === false ? 'border-red-500/30 bg-[#1a0f12]' : 'border-[#f9eee7]/10 bg-[#080709]'} rounded space-y-4 transition-colors`}>

          <div className="flex justify-between items-center mb-2">

            <span className="text-sm font-semibold text-[#a99594] flex items-center gap-2">

              #{service.numero} 

              {service.ativo === false && <span className="text-red-400 text-xs px-2 py-0.5 bg-red-900/30 rounded">(Oculto)</span>}

            </span>

            <div className="flex gap-2">

              <Button 

                variant="outline" 

                size="sm" 

                className="h-8 border-[#f9eee7]/20 text-[#a99594] hover:text-[#f9eee7] hover:bg-[#2a2a2a]"

                onClick={() => handleChange(idx, 'ativo', service.ativo === false ? true : false)}

                title={service.ativo === false ? 'Mostrar no site' : 'Ocultar do site'}

              >

                {service.ativo === false ? <EyeOff size={16} /> : <Eye size={16} />}

              </Button>

              <Button 

                variant="destructive" 

                size="sm" 

                className="h-8"

                onClick={() => handleDelete(idx, service.id)}

              >

                <Trash2 size={16} />

              </Button>

            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div><Label className="text-[#d1bbb6]">Tí­tulo</Label><Input className="bg-[#111014] border-[#f9eee7]/20 text-[#f9eee7]" value={service.titulo || ''} onChange={e => handleChange(idx, 'titulo', e.target.value)} /></div>

            <div><Label className="text-[#d1bbb6]">Detalhe</Label><Input className="bg-[#111014] border-[#f9eee7]/20 text-[#f9eee7]" value={service.detalhe || ''} onChange={e => handleChange(idx, 'detalhe', e.target.value)} /></div>

            <div className="md:col-span-2"><Label className="text-[#d1bbb6]">Descrição</Label><Input className="bg-[#111014] border-[#f9eee7]/20 text-[#f9eee7]" value={service.descricao || ''} onChange={e => handleChange(idx, 'descricao', e.target.value)} /></div>

            <div><Label className="text-[#d1bbb6]">Ícone (ex: Scissors, Palette, Sparkles)</Label><Input className="bg-[#111014] border-[#f9eee7]/20 text-[#f9eee7]" value={service.icone || ''} onChange={e => handleChange(idx, 'icone', e.target.value)} /></div>

            <div><Label className="text-[#d1bbb6]">Número / Posição (ex: 01, 02)</Label><Input className="bg-[#111014] border-[#f9eee7]/20 text-[#f9eee7]" value={service.numero || ''} onChange={e => handleChange(idx, 'numero', e.target.value)} /></div>

          </div>

        </div>

      ))}

      <div className="flex justify-between items-center pt-4 border-t border-[#f9eee7]/10">

        <Button onClick={handleAdd} variant="outline" className="border-[#f9eee7]/20 text-[#f9eee7] hover:bg-[#f9eee7]">

          <Plus className="mr-2 h-4 w-4" /> Adicionar Serviço

        </Button>

        <Button onClick={handleSave} disabled={saving} className="bg-[#d68c80] text-[#24161d] hover:bg-[#df9587]">

          <Save className="mr-2 h-4 w-4" /> {saving ? 'Salvando...' : 'Salvar Todas as Alterações'}

        </Button>

      </div>

    </div>

  );

}



function GalleryManager() {

  const query = useGallery();

  

  if (query.isLoading) return <p>Carregando galeria...</p>;

  return <GalleryList items={query.data || []} onSuccess={() => query.refetch()} />;

}



function GalleryList({ items, onSuccess }: { items: any[], onSuccess: () => void }) {

  const { toast } = useToast();

  const [data, setData] = useState(items);

  const [saving, setSaving] = useState(false);

  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);



  useEffect(() => { setData(items); }, [items]);



  const handleChange = (index: number, field: string, value: any) => {

    const updated = [...data];

    updated[index] = { ...updated[index], [field]: value };

    setData(updated);

  };



  const handleAdd = () => {

    setData([...data, { rotulo: "Nova Foto", texto_alternativo: "", tamanho: "small", url_imagem: "", ordem: data.length + 1 }]);

  };



  const handleDelete = async (index: number, id?: string) => {

    if (!confirm("Tem certeza que deseja excluir esta foto?")) return;

    if (id) {

      await supabase.from("galeria").delete().eq("id", id);

    }

    const updated = [...data];

    updated.splice(index, 1);

    setData(updated);

    toast({ title: "Foto removida." });

    if (id) onSuccess();

  };



  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {

    const file = e.target.files?.[0];

    if (!file) return;



    setUploadingIdx(index);

    try {

      const fileExt = file.name.split(".").pop();

      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      

      const { error: uploadError } = await supabase.storage.from("fotos").upload(fileName, file);

      if (uploadError) throw uploadError;



      const { data: { publicUrl } } = supabase.storage.from("fotos").getPublicUrl(fileName);

      

      handleChange(index, "url_imagem", publicUrl);

      toast({ title: "Foto enviada com sucesso!" });

    } catch (err: any) {

      toast({ title: "Erro no upload", description: err.message, variant: "destructive" });

    } finally {

      setUploadingIdx(null);

    }

  };



  const handleSave = async () => {

    setSaving(true);

    const promises = data.map(item => {

      if (!item.id) {

        return supabase.from("galeria").insert({

          url_imagem: item.url_imagem,

          texto_alternativo: item.texto_alternativo,

          rotulo: item.rotulo,

          tamanho: item.tamanho,

          ordem: item.ordem

        });

      }

      return supabase.from("galeria").update(item).eq("id", item.id);

    });

    

    await Promise.all(promises);

    setSaving(false);

    toast({ title: "Galeria salva com sucesso!" });

    onSuccess();

  };



  return (

    <div className="space-y-6">

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">

        {data.map((item, idx) => (

          <div key={item.id || `new-gal-${idx}`} className="p-4 border border-[#f9eee7]/10 rounded bg-[#080709] flex flex-col gap-3 relative group">

            <Button variant="destructive" size="sm" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 h-8 w-8 p-0" onClick={() => handleDelete(idx, item.id)}>

              <Trash2 size={14} />

            </Button>

            

            <div className="aspect-square bg-[#111014] rounded overflow-hidden relative flex items-center justify-center border border-[#f9eee7]/10">

              {item.url_imagem ? (

                <img src={item.url_imagem} alt="preview" className="w-full h-full object-cover" />

              ) : (

                <span className="text-xs text-[#a99594]">Sem imagem</span>

              )}

              {uploadingIdx === idx && (

                <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-xs">

                  Enviando...

                </div>

              )}

            </div>



            <div className="space-y-3 mt-2">

              <div>

                <Label className="text-[#d1bbb6] text-xs">Trocar / Enviar Foto</Label>

                <Input type="file" accept="image/*" onChange={(e) => handleFileChange(e, idx)} className="bg-[#111014] border-[#f9eee7]/20 text-[#f9eee7] text-xs h-8" />

              </div>

              <div>

                <Label className="text-[#d1bbb6] text-xs">Rótulo</Label>

                <Input className="bg-[#111014] border-[#f9eee7]/20 text-[#f9eee7] h-8 text-xs" value={item.rotulo || ""} onChange={e => handleChange(idx, "rotulo", e.target.value)} placeholder="Ex: Textura & luz" />

              </div>

              <div className="grid grid-cols-2 gap-2">

                <div>

                  <Label className="text-[#d1bbb6] text-xs">Tamanho</Label>

                  <select className="flex h-8 w-full rounded-md border border-[#f9eee7]/20 bg-[#111014] px-3 py-1 text-xs text-[#f9eee7]" value={item.tamanho || "small"} onChange={e => handleChange(idx, "tamanho", e.target.value)}>

                    <option value="small">Pequeno</option>

                    <option value="large">Grande</option>

                    <option value="tall">Alto</option>

                  </select>

                </div>

                <div>

                  <Label className="text-[#d1bbb6] text-xs">Ordem</Label>

                  <Input type="number" className="bg-[#111014] border-[#f9eee7]/20 text-[#f9eee7] h-8 text-xs" value={item.ordem || 0} onChange={e => handleChange(idx, "ordem", parseInt(e.target.value))} />

                </div>

              </div>

            </div>

          </div>

        ))}

      </div>

      <div className="flex justify-between items-center pt-4 border-t border-[#f9eee7]/10">

        <Button onClick={handleAdd} variant="outline" className="border-[#f9eee7]/20 text-[#f9eee7] hover:bg-[#f9eee7]">

          <Plus className="mr-2 h-4 w-4" /> Adicionar Foto

        </Button>

        <Button onClick={handleSave} disabled={saving} className="bg-[#d68c80] text-[#24161d] hover:bg-[#df9587]">

          <Save className="mr-2 h-4 w-4" /> {saving ? "Salvando..." : "Salvar Galeria"}

        </Button>

      </div>

    </div>

  );

}



function CombosManager({ config, combos, onSuccess }: { config: Record<string, string>; combos: any[]; onSuccess: () => void }) {
  const { toast } = useToast();
  const [visible, setVisible] = useState(config?.combosVisiveis === 'true');
  const [data, setData] = useState(combos);
  const [saving, setSaving] = useState(false);
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);

  useEffect(() => { setData(combos); }, [combos]);
  useEffect(() => { setVisible(config?.combosVisiveis === 'true'); }, [config?.combosVisiveis]);

  const handleToggleVisibility = async () => {
    const newVal = !visible;
    setVisible(newVal);
    await supabase.from('configuracoes').upsert({ id: 'combosVisiveis', valor: String(newVal) });
    toast({ title: newVal ? 'Seção de combos visível no site' : 'Seção de combos oculta do site' });
    onSuccess();
  };

  const handleChange = (index: number, field: string, value: any) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    setData(updated);
  };

  const handleAdd = () => {
    setData([...data, { titulo: '', descricao: '', imagem_url: '', ativo: true, ordem: data.length + 1 }]);
  };

  const handleDelete = async (index: number, id?: string) => {
    if (!confirm('Tem certeza que deseja excluir este combo?')) return;
    if (id) {
      await supabase.from('combos_promo').delete().eq('id', id);
    }
    const updated = [...data];
    updated.splice(index, 1);
    setData(updated);
    toast({ title: 'Combo removido.' });
    if (id) onSuccess();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingIdx(index);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `combo-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('fotos').upload(fileName, file);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from('fotos').getPublicUrl(fileName);
      handleChange(index, 'imagem_url', publicUrl);
      toast({ title: 'Foto enviada com sucesso!' });
    } catch (err: any) {
      toast({ title: 'Erro no upload', description: err.message, variant: 'destructive' });
    } finally {
      setUploadingIdx(null);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const promises = data.map(item => {
      const payload = {
        titulo: item.titulo,
        descricao: item.descricao,
        imagem_url: item.imagem_url,
        ativo: item.ativo,
        ordem: item.ordem,
      };
      if (!item.id) {
        return supabase.from('combos_promo').insert(payload);
      }
      return supabase.from('combos_promo').update(payload).eq('id', item.id);
    });
    const results = await Promise.all(promises);
    const errors = results.filter(r => r.error).map(r => r.error);
    if (errors.length > 0) {
      console.error(errors);
      toast({ title: 'Erro ao salvar', description: errors[0]?.message, variant: 'destructive' });
      setSaving(false);
      return;
    }
    setSaving(false);
    toast({ title: 'Combos salvos com sucesso!' });
    onSuccess();
  };

  return (
    <div className="space-y-6">
      {/* Toggle de visibilidade global */}
      <div className="flex items-center justify-between p-4 rounded-lg border border-[#f9eee7]/10 bg-[#080709]">
        <div>
          <p className="text-sm font-medium text-[#f9eee7]">Seção visível no site</p>
          <p className="text-xs text-[#a99594] mt-1">Quando ativada, a seção de combos aparece entre a Hero e os Serviços.</p>
        </div>
        <button
          type="button"
          onClick={handleToggleVisibility}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-colors ${visible ? 'bg-[#df9587] text-[#080709]' : 'bg-[#1a1a1a] text-[#a99594] border border-[#f9eee7]/20'}`}
        >
          {visible ? <><ToggleRight size={16} /> Visível</> : <><ToggleLeft size={16} /> Oculta</>}
        </button>
      </div>

      {/* Lista de combos */}
      {data.map((combo, idx) => (
        <div key={combo.id || `new-combo-${idx}`} className={`p-4 border ${combo.ativo === false ? 'border-red-500/30 bg-[#1a0f12]' : 'border-[#f9eee7]/10 bg-[#080709]'} rounded-lg space-y-4 transition-colors`}>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-[#a99594] flex items-center gap-2">
              Combo #{idx + 1}
              {combo.ativo === false && <span className="text-red-400 text-xs px-2 py-0.5 bg-red-900/30 rounded">(Oculto)</span>}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 border-[#f9eee7]/20 text-[#a99594] hover:text-[#f9eee7] hover:bg-[#2a2a2a]"
                onClick={() => handleChange(idx, 'ativo', combo.ativo === false ? true : false)}
                title={combo.ativo === false ? 'Ativar combo' : 'Desativar combo'}
              >
                {combo.ativo === false ? <EyeOff size={16} /> : <Eye size={16} />}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="h-8"
                onClick={() => handleDelete(idx, combo.id)}
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Imagem */}
            <div className="space-y-3">
              <div className="aspect-video bg-[#111014] rounded overflow-hidden relative flex items-center justify-center border border-[#f9eee7]/10">
                {combo.imagem_url ? (
                  <img src={combo.imagem_url} alt="preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-[#a99594]">
                    <Image size={24} />
                    <span className="text-xs">Sem imagem</span>
                  </div>
                )}
                {uploadingIdx === idx && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-xs">
                    Enviando...
                  </div>
                )}
              </div>
              <div>
                <Label className="text-[#d1bbb6] text-xs">Enviar Foto (PNG ou JPG)</Label>
                <Input type="file" accept="image/png, image/jpeg" onChange={(e) => handleFileChange(e, idx)} className="bg-[#111014] border-[#f9eee7]/20 text-[#f9eee7] text-xs h-8" />
              </div>
            </div>

            {/* Título + Descrição */}
            <div className="space-y-4">
              <div>
                <Label className="text-[#d1bbb6]">Título do Combo</Label>
                <Input className="bg-[#111014] border-[#f9eee7]/20 text-[#f9eee7]" value={combo.titulo || ''} onChange={e => handleChange(idx, 'titulo', e.target.value)} placeholder="Ex: Combo Verão Brilhante" />
              </div>
              <div>
                <Label className="text-[#d1bbb6]">Descrição</Label>
                <Textarea className="bg-[#111014] border-[#f9eee7]/20 text-[#f9eee7] min-h-[120px]" value={combo.descricao || ''} onChange={e => handleChange(idx, 'descricao', e.target.value)} placeholder="Descreva o que inclui no combo, preço, condições..." />
              </div>
              <div>
                <Label className="text-[#d1bbb6]">Ordem</Label>
                <Input type="number" className="bg-[#111014] border-[#f9eee7]/20 text-[#f9eee7] h-8" value={combo.ordem || 0} onChange={e => handleChange(idx, 'ordem', parseInt(e.target.value))} />
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="flex justify-between items-center pt-4 border-t border-[#f9eee7]/10">
        <Button onClick={handleAdd} variant="outline" className="border-[#f9eee7]/20 text-[#f9eee7] hover:bg-[#f9eee7]">
          <Plus className="mr-2 h-4 w-4" /> Adicionar Combo
        </Button>
        <Button onClick={handleSave} disabled={saving} className="bg-[#d68c80] text-[#24161d] hover:bg-[#df9587]">
          <Save className="mr-2 h-4 w-4" /> {saving ? 'Salvando...' : 'Salvar Combos'}
        </Button>
      </div>
    </div>
  );
}
