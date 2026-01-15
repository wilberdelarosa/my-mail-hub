-- Seed: Equipos pesados (alquiler) y materiales (RD$)

INSERT INTO public.equipment (code, name, description, default_unit, default_price, is_taxable, category, is_active)
VALUES
  ('ALQ-EXC-320', 'Excavadora 320', 'Alquiler de excavadora hidráulica CAT 320 con operador.', 'HR', 3500.00, true, 'ALQUILER_EQUIPO', true),
  ('ALQ-EXC-330', 'Excavadora 330', 'Alquiler de excavadora hidráulica CAT 330 con operador.', 'HR', 4500.00, true, 'ALQUILER_EQUIPO', true),
  ('ALQ-RETRO', 'Retroexcavadora', 'Alquiler de retroexcavadora con operador.', 'HR', 2800.00, true, 'ALQUILER_EQUIPO', true),
  ('ALQ-BULL-D6', 'Bulldozer D6', 'Alquiler de bulldozer D6 con operador.', 'HR', 4800.00, true, 'ALQUILER_EQUIPO', true),
  ('ALQ-BULL-D8', 'Bulldozer D8', 'Alquiler de bulldozer D8 con operador.', 'HR', 6500.00, true, 'ALQUILER_EQUIPO', true),
  ('ALQ-CARG-950', 'Cargador Frontal 950', 'Alquiler de cargador frontal CAT 950 con operador.', 'HR', 4200.00, true, 'ALQUILER_EQUIPO', true),
  ('ALQ-MOTO', 'Motoconformadora', 'Alquiler de motoconformadora con operador.', 'HR', 5200.00, true, 'ALQUILER_EQUIPO', true),
  ('ALQ-ROD-10T', 'Rodillo Compactador 10T', 'Alquiler de rodillo compactador 10 toneladas.', 'HR', 3000.00, true, 'ALQUILER_EQUIPO', true),
  ('ALQ-ROD-15T', 'Rodillo Compactador 15T', 'Alquiler de rodillo compactador 15 toneladas.', 'HR', 3600.00, true, 'ALQUILER_EQUIPO', true),
  ('ALQ-GRUA-20T', 'Grúa 20 Ton', 'Alquiler de grúa hidráulica 20 toneladas con operador.', 'HR', 7000.00, true, 'ALQUILER_EQUIPO', true),
  ('ALQ-CAM-6X4', 'Camión Volteo 6x4', 'Alquiler de camión volteo 6x4 con conductor.', 'VJ', 18000.00, true, 'ALQUILER_EQUIPO', true),
  ('ALQ-CAM-8X4', 'Camión Volteo 8x4', 'Alquiler de camión volteo 8x4 con conductor.', 'VJ', 24000.00, true, 'ALQUILER_EQUIPO', true),
  ('ALQ-LOWBOY', 'Transporte Lowboy', 'Transporte de equipos pesados en lowboy.', 'VJ', 25000.00, true, 'TRANSPORTE', true),

  ('MAT-GRA-3/4', 'Grava 3/4"', 'Agregado triturado 3/4".', 'M3', 2200.00, true, 'MATERIALES', true),
  ('MAT-GRA-1/2', 'Grava 1/2"', 'Agregado triturado 1/2".', 'M3', 2100.00, true, 'MATERIALES', true),
  ('MAT-ARENA', 'Arena Lavada', 'Arena lavada para construcción.', 'M3', 1500.00, true, 'MATERIALES', true),
  ('MAT-ARENA-F', 'Arena Fina', 'Arena fina para terminaciones.', 'M3', 1400.00, true, 'MATERIALES', true),
  ('MAT-CALICHE', 'Caliche', 'Material de base caliche.', 'M3', 900.00, true, 'MATERIALES', true),
  ('MAT-BASE', 'Base Granular', 'Base granular compactable.', 'M3', 1800.00, true, 'MATERIALES', true),
  ('MAT-CONCASA', 'Concasá', 'Material triturado mixto.', 'M3', 1700.00, true, 'MATERIALES', true),
  ('MAT-RELLENO', 'Relleno Seleccionado', 'Material de relleno seleccionado.', 'M3', 1200.00, true, 'MATERIALES', true)
ON CONFLICT (code) DO NOTHING;
