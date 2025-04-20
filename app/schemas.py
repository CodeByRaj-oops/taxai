"""
Schema definitions for request validation using Pydantic
"""
from pydantic import BaseModel, Field, root_validator
from typing import Optional, Dict, Any, Union


class TaxInput(BaseModel):
    """Schema for tax input data"""
    basicSalary: Optional[float] = Field(None, description="Basic salary amount")
    hra: Optional[float] = Field(None, description="House Rent Allowance amount")
    specialAllowance: Optional[float] = Field(None, description="Special allowance amount")
    lta: Optional[float] = Field(None, description="Leave Travel Allowance amount")
    otherIncome: Optional[float] = Field(None, description="Other income sources")
    rentPaid: Optional[float] = Field(None, description="Annual rent paid")
    cityType: Optional[str] = Field(None, description="Type of city (metro/non-metro)")
    section80C: Optional[float] = Field(None, description="Section 80C deductions")
    section80D_self: Optional[float] = Field(None, description="Health insurance for self & family")
    section80D_parents: Optional[float] = Field(None, description="Health insurance for parents")
    nps: Optional[float] = Field(None, description="National Pension Scheme contribution")
    homeLoanInterest: Optional[float] = Field(None, description="Home loan interest payment")


class TaxResult(BaseModel):
    """Schema for tax calculation results"""
    oldRegime: Optional[Dict[str, Any]] = Field(None, description="Old regime calculation results")
    newRegime: Optional[Dict[str, Any]] = Field(None, description="New regime calculation results")
    bestRegime: Optional[str] = Field(None, description="Recommended tax regime")
    totalSavings: Optional[float] = Field(None, description="Potential tax savings amount")


class TaxData(BaseModel):
    """Schema for combined tax input and result data"""
    taxInputs: Optional[TaxInput] = None
    taxResults: Optional[TaxResult] = None


class ChatRequest(BaseModel):
    """Schema for chat API request"""
    message: str = Field(..., min_length=1, description="User's message")
    taxData: Optional[TaxData] = Field(None, description="Tax calculation data")

    @root_validator
    def check_message_not_empty(cls, values):
        """Validate that message is not empty string"""
        if values.get('message') and not values.get('message').strip():
            raise ValueError("Message cannot be empty")
        return values 