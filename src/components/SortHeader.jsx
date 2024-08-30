import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretUp, faCaretDown } from "@fortawesome/free-solid-svg-icons";

const SortHeader = ({ label, sortKey, sortConfig, requestSort }) => {
  const getSortIcon = () => {
    if (sortConfig.key !== sortKey) return null;
    return sortConfig.direction === "ascending" ? (
      <FontAwesomeIcon icon={faCaretUp} />
    ) : (
      <FontAwesomeIcon icon={faCaretDown} />
    );
  };

  return (
    <th onClick={() => requestSort(sortKey)}>
      {label} {getSortIcon()}
    </th>
  );
};

export default SortHeader;
