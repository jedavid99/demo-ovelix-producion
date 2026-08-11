import { useNavigate } from 'react-router-dom';

export function useRepairNavigation(closeDropdown: () => void) {
  const navigate = useNavigate();

  const navigateToEdit = (repairId: string) => {
    closeDropdown();
    navigate(`/reparaciones/edit/${repairId}`, { state: { reload: true } });
  };

  return { navigateToEdit };
}
