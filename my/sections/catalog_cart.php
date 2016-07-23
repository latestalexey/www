<?
class TpDB
{

	function Add($arFields, $defaultFields, $tableName)
	{
		
		global $DB;
		
		/*$defaultFields = array(
			"PARTNER_ID" => 0,
			"VID" => "",
			"ADRESS" => "");
		*/	
		foreach($defaultFields as $key => $value)
			if(!array_key_exists($key, $arFields))
				$arFields[$key] = $value;

		$arInsert = $DB->PrepareInsert($tableName, $arFields);
		$strSql =
			"INSERT INTO ".$tableName."(".$arInsert[0].") ".
				 "VALUES(".$arInsert[1].")";
		$res=$DB->Query($strSql, true, "FILE: ".__FILE__."<br> LINE: ".__LINE__);
		if($res == false)
			return false;
		else
			return $DB->LastID();
			
	}

	function Update($ID, $arFields, $tableName)
	{
		
		global $DB;
		
		$strUpdate = $DB->PrepareUpdate($tableName, $arFields);
		$strSql = "UPDATE ".$tableName." SET ".$strUpdate." WHERE ID=".$ID;
		$result = $DB->Query($strSql, true, "FILE: ".__FILE__."<br> LINE: ".__LINE__);
		return $result;
	}

	function GetList($arFilter, $tableName)
	{
		
		global $DB;
		
		$strSql = "SELECT ".$tableName.".* FROM ".$tableName." ";
		if(count($arFilter)>0)
			$strSql = $strSql."WHERE";
		
		$logic = "";
		foreach($arFilter as $key => $value)
		{
			if (is_array($value))
			{
				$strvalues = "";
				$zap = "";
				foreach($value as $value_elem)
				{
					$strvalues = $strvalues."".$zap."'".$value_elem."'";
					$zap = ",";
				}
				$strSql = $strSql." ".$logic." ".$key." IN (".$strvalues.")";
			}
			else
			{			
				$strSql = $strSql." ".$logic." ".$key." = '".$value."'";
			}	
			$logic = "AND";
		}

		$result = $DB->Query($strSql, true, "FILE: ".__FILE__."<br> LINE: ".__LINE__);
		
		return $result;
	}
	
	function GetListExt($arFilter, $arFields, $tableName)
	{
		
		global $DB;
		
		$strSql = "SELECT ";
		if(is_array($arFields))
		{
			$i = 0;
			foreach($arFields as $key => $value)
			{
			$i = $i + 1;
			$strSql = $strSql.$tableName.".".$value;
			if($i<count($arFields))
				$strSql = $strSql.", ";
			}
			$strSql = $strSql." FROM ".$tableName." ";
		}
		else
		{
			$strSql = $strSql.$tableName.".* FROM ".$tableName." ";
		}
		
		if(count($arFilter)>0)
			$strSql = $strSql."WHERE";
		
		$logic = "";
		foreach($arFilter as $key => $value)
		{
			$strSql = $strSql." ".$logic." ".$key." = '".$value."'";
			$logic = "AND";
		}
		$result = $DB->Query($strSql, true, "FILE: ".__FILE__."<br> LINE: ".__LINE__);
		
		return $result;
	}

	function Delete($arFilter, $tableName)
	{
		
		global $DB;
		
		$strSql = "DELETE FROM ".$tableName." ";
		if(count($arFilter)>0)
			$strSql = $strSql."WHERE";
		
		$logic = "";
		foreach($arFilter as $key => $value)
		{
			if (is_array($value))
			{
				$strvalues = "";
				$zap = "";
				foreach($value as $value_elem)
				{
					$strvalues = $strvalues."".$zap."'".$value_elem."'";
					$zap = ",";
				}
				$strSql = $strSql." ".$logic." ".$key." IN (".$strvalues.")";
			}
			else
			{			
				$strSql = $strSql." ".$logic." ".$key." = '".$value."'";
			}	
			$logic = "AND";
		}

		$result = $DB->Query($strSql, true, "FILE: ".__FILE__."<br> LINE: ".__LINE__);
		
		return $result;
	}
}

class NewOrder
{

	function AddItem($item, $quantity)
	{
	}

	function DeleteItem($item, $quantity)
	{
	}

?>
