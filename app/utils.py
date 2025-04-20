"""
Utility functions for the application
"""
import logging
from typing import Dict, Any, Optional

logger = logging.getLogger(__name__)

def format_currency(amount: Optional[float]) -> str:
    """
    Format a numeric amount as Indian currency (INR)
    
    Args:
        amount: Numeric amount to format
        
    Returns:
        Formatted currency string with INR symbol
    """
    if amount is None:
        amount = 0
        
    try:
        # Format as Indian currency (INR)
        return f"₹{amount:,.0f}"
    except (ValueError, TypeError) as e:
        logger.warning(f"Error formatting currency value {amount}: {str(e)}")
        return f"₹0"

def prepare_tax_context(message: str, tax_data: Optional[Dict[str, Any]] = None) -> str:
    """
    Prepare context string for OpenAI with tax data if available
    
    Args:
        message: User's message
        tax_data: Dictionary containing tax inputs and results
        
    Returns:
        Formatted context string for OpenAI
    """
    if not tax_data:
        return message
        
    try:
        tax_inputs = tax_data.get('taxInputs', {})
        tax_results = tax_data.get('taxResults', {})
        
        # Format tax data as a context string
        context = f"""
Current tax calculation data:
- Basic Salary: {format_currency(tax_inputs.get('basicSalary'))}
- HRA Received: {format_currency(tax_inputs.get('hra'))}
- Special Allowance: {format_currency(tax_inputs.get('specialAllowance'))}
- LTA: {format_currency(tax_inputs.get('lta'))}
- Other Income: {format_currency(tax_inputs.get('otherIncome'))}
- Rent Paid: {format_currency(tax_inputs.get('rentPaid'))}
- City Type: {tax_inputs.get('cityType') or 'Not specified'}

Deductions:
- Section 80C: {format_currency(tax_inputs.get('section80C'))}
- Health Insurance (Self & Family): {format_currency(tax_inputs.get('section80D_self'))}
- Health Insurance (Parents): {format_currency(tax_inputs.get('section80D_parents'))}
- NPS Additional: {format_currency(tax_inputs.get('nps'))}
- Home Loan Interest: {format_currency(tax_inputs.get('homeLoanInterest'))}

Tax Calculation Results:
- Old Regime Tax: {format_currency(tax_results.get('oldRegime', {}).get('taxAmount'))}
- New Regime Tax: {format_currency(tax_results.get('newRegime', {}).get('taxAmount'))}
- Recommended Regime: {tax_results.get('bestRegime') == 'old' and 'Old Regime' or 'New Regime'}
- Tax Savings with Recommended Regime: {format_currency(tax_results.get('totalSavings'))}

The user is asking: "{message}"
"""
        return context
        
    except Exception as e:
        logger.error(f"Error preparing tax context: {str(e)}")
        # Fall back to just the message if there's an error
        return message

def create_response(data=None, error=None, status="success"):
    """
    Create a standardized JSON response structure
    
    Args:
        data: Response data (optional)
        error: Error message (optional)
        status: Status string ("success" or "error")
        
    Returns:
        Dictionary with standardized structure
    """
    response = {
        "status": status
    }
    
    if data is not None:
        response["data"] = data
        
    if error is not None:
        response["error"] = error
        response["status"] = "error"
        
    return response 